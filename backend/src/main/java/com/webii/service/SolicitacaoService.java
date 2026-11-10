package com.webii.service;

import com.webii.dto.ManutencaoDTO;
import com.webii.dto.OrcamentoDTO;
import com.webii.dto.RedirecionamentoDTO;
import com.webii.dto.SolicitacaoCreateDTO;
import com.webii.entity.Category;
import com.webii.entity.Client;
import com.webii.entity.Employee;
import com.webii.entity.HistoricoSolicitacao;
import com.webii.entity.Solicitacao;
import com.webii.enums.EstadoSolicitacao;
import com.webii.repository.CategoryRepository;
import com.webii.repository.ClientRepository;
import com.webii.repository.EmployeeRepository;
import com.webii.repository.HistoricoSolicitacaoRepository;
import com.webii.repository.SolicitacaoRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

@Service
@Transactional
public class SolicitacaoService {
    private final SolicitacaoRepository solicitacaoRepository;
    private final HistoricoSolicitacaoRepository historicoRepository;
    private final ClientRepository clientRepository;
    private final CategoryRepository categoryRepository;
    private final EmployeeRepository employeeRepository;

    public SolicitacaoService(SolicitacaoRepository solicitacaoRepository,
                              HistoricoSolicitacaoRepository historicoRepository,
                              ClientRepository clientRepository,
                              CategoryRepository categoryRepository,
                              EmployeeRepository employeeRepository) {
        this.solicitacaoRepository = solicitacaoRepository;
        this.historicoRepository = historicoRepository;
        this.clientRepository = clientRepository;
        this.categoryRepository = categoryRepository;
        this.employeeRepository = employeeRepository;
    }

    @Transactional(readOnly = true)
    public List<Solicitacao> listarTodas() {
        return solicitacaoRepository.findAll(Sort.by("dataHoraAbertura").ascending());
    }

    @Transactional(readOnly = true)
    public Solicitacao buscarPorId(Long id) {
        return solicitacaoRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Solicitação não encontrada."));
    }

    @Transactional(readOnly = true)
    public List<Solicitacao> listarPorCliente(Long clienteId) {
        return ordenar(solicitacaoRepository.findByClienteId(clienteId));
    }

    @Transactional(readOnly = true)
    public List<Solicitacao> listarAbertas() {
        return ordenar(solicitacaoRepository.findByEstado(EstadoSolicitacao.ABERTA));
    }

    public Solicitacao abrirSolicitacao(Long clienteId, SolicitacaoCreateDTO dto) {
        Client cliente = clientRepository.findById(clienteId)
            .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado."));
        Category categoria = categoryRepository.findById(dto.getCategoriaId())
            .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada."));
        if (!Boolean.TRUE.equals(categoria.getAtivo())) {
            throw new IllegalStateException("A categoria selecionada está inativa.");
        }
        Solicitacao solicitacao = Solicitacao.builder()
            .cliente(cliente)
            .categoriaEquipamento(categoria)
            .descricaoEquipamento(dto.getDescricaoEquipamento().trim())
            .descricaoDefeito(dto.getDescricaoDefeito().trim())
            .dataHoraAbertura(LocalDateTime.now())
            .estado(EstadoSolicitacao.ABERTA)
            .build();
        return salvarEstado(solicitacao, EstadoSolicitacao.ABERTA,
            "Solicitação aberta pelo cliente.", null, null);
    }

    public Solicitacao efetuarOrcamento(Long id, OrcamentoDTO dto) {
        Solicitacao solicitacao = buscarPorId(id);
        exigirEstado(solicitacao, EstadoSolicitacao.ABERTA);
        Employee funcionario = buscarFuncionario(dto.getFuncionarioId());
        solicitacao.setValorOrcamento(dto.getValor());
        solicitacao.setDataHoraOrcamento(LocalDateTime.now());
        solicitacao.setFuncionarioOrcamento(funcionario);
        return salvarEstado(solicitacao, EstadoSolicitacao.ORCADA,
            "Orçamento registrado.", funcionario, null);
    }

    public Solicitacao aprovarServico(Long id) {
        Solicitacao solicitacao = buscarPorId(id);
        exigirEstado(solicitacao, EstadoSolicitacao.ORCADA, EstadoSolicitacao.REJEITADA);
        String observacao = solicitacao.getEstado() == EstadoSolicitacao.REJEITADA
            ? "Serviço resgatado: de REJEITADA para APROVADA." : "Serviço aprovado pelo cliente.";
        return salvarEstado(solicitacao, EstadoSolicitacao.APROVADA, observacao, null, null);
    }

    public Solicitacao rejeitarServico(Long id, String motivo) {
        Solicitacao solicitacao = buscarPorId(id);
        exigirEstado(solicitacao, EstadoSolicitacao.ORCADA);
        solicitacao.setMotivoRejeicao(motivo.trim());
        return salvarEstado(solicitacao, EstadoSolicitacao.REJEITADA, motivo.trim(), null, null);
    }

    public Solicitacao efetuarManutencao(Long id, ManutencaoDTO dto) {
        Solicitacao solicitacao = buscarPorId(id);
        exigirEstado(solicitacao, EstadoSolicitacao.APROVADA, EstadoSolicitacao.REDIRECIONADA);
        Employee funcionario = buscarFuncionario(dto.getFuncionarioId());
        exigirResponsavel(solicitacao, funcionario);
        solicitacao.setDescricaoManutencao(dto.getDescricaoManutencao().trim());
        solicitacao.setOrientacoesCliente(dto.getOrientacoesCliente().trim());
        solicitacao.setFuncionarioManutencao(funcionario);
        solicitacao.setDataHoraManutencao(LocalDateTime.now());
        return salvarEstado(solicitacao, EstadoSolicitacao.ARRUMADA,
            "Manutenção realizada.", funcionario, null);
    }

    public Solicitacao redirecionarManutencao(Long id, RedirecionamentoDTO dto) {
        Solicitacao solicitacao = buscarPorId(id);
        exigirEstado(solicitacao, EstadoSolicitacao.APROVADA, EstadoSolicitacao.REDIRECIONADA);
        Employee origem = buscarFuncionario(dto.getFuncionarioOrigemId());
        Employee destino = buscarFuncionario(dto.getFuncionarioDestinoId());
        exigirResponsavel(solicitacao, origem);
        if (origem.getId().equals(destino.getId())) {
            throw new IllegalStateException("Uma solicitação não pode ser redirecionada para o mesmo funcionário.");
        }
        solicitacao.setFuncionarioDestino(destino);
        return salvarEstado(solicitacao, EstadoSolicitacao.REDIRECIONADA,
            "Redirecionada de " + origem.getName() + " para " + destino.getName() + ".", origem, destino);
    }

    public Solicitacao pagarServico(Long id) {
        Solicitacao solicitacao = buscarPorId(id);
        exigirEstado(solicitacao, EstadoSolicitacao.ARRUMADA);
        solicitacao.setDataHoraPagamento(LocalDateTime.now());
        return salvarEstado(solicitacao, EstadoSolicitacao.PAGA,
            "Pagamento confirmado pelo cliente.", null, null);
    }

    public Solicitacao finalizarSolicitacao(Long id, Long funcionarioId) {
        Solicitacao solicitacao = buscarPorId(id);
        exigirEstado(solicitacao, EstadoSolicitacao.PAGA);
        Employee funcionario = buscarFuncionario(funcionarioId);
        return salvarEstado(solicitacao, EstadoSolicitacao.FINALIZADA,
            "Solicitação finalizada.", funcionario, null);
    }

    private Solicitacao salvarEstado(Solicitacao solicitacao, EstadoSolicitacao estado,
                                     String observacao, Employee funcionario, Employee destino) {
        solicitacao.setEstado(estado);
        Solicitacao salva = solicitacaoRepository.save(solicitacao);
        HistoricoSolicitacao historico = HistoricoSolicitacao.builder()
            .solicitacao(salva)
            .estado(estado)
            .dataHora(LocalDateTime.now())
            .observacao(observacao)
            .funcionario(funcionario)
            .funcionarioDestino(destino)
            .build();
        historicoRepository.save(historico);
        salva.getHistorico().add(historico);
        return salva;
    }

    private Employee buscarFuncionario(Long id) {
        Employee funcionario = employeeRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Funcionário não encontrado."));
        if (!Boolean.TRUE.equals(funcionario.getUser().getAtivo())) {
            throw new IllegalStateException("O funcionário está inativo.");
        }
        return funcionario;
    }

    private void exigirEstado(Solicitacao solicitacao, EstadoSolicitacao... permitidos) {
        if (Arrays.stream(permitidos).noneMatch(estado -> estado == solicitacao.getEstado())) {
            throw new IllegalStateException("Operação não permitida para a solicitação no estado "
                + solicitacao.getEstado() + ".");
        }
    }

    private void exigirResponsavel(Solicitacao solicitacao, Employee funcionario) {
        if (solicitacao.getEstado() == EstadoSolicitacao.REDIRECIONADA
            && (solicitacao.getFuncionarioDestino() == null
                || !solicitacao.getFuncionarioDestino().getId().equals(funcionario.getId()))) {
            throw new IllegalStateException("A solicitação está redirecionada para outro funcionário.");
        }
    }

    private List<Solicitacao> ordenar(List<Solicitacao> solicitacoes) {
        return solicitacoes.stream().sorted(Comparator.comparing(Solicitacao::getDataHoraAbertura)).toList();
    }
}
