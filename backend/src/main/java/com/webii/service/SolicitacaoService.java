package com.webii.service;

import com.webii.dto.*;
import com.webii.entity.*;
import com.webii.enums.EstadoSolicitacao;
import com.webii.repository.HistoricoSolicitacaoRepository;
import com.webii.repository.SolicitacaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SolicitacaoService {

    private final SolicitacaoRepository solicitacaoRepository;
    private final HistoricoSolicitacaoRepository historicoRepository;
    private final ClientService clientService;
    private final CategoryService categoryService;
    private final EmployeeService employeeService;

    public SolicitacaoService(SolicitacaoRepository solicitacaoRepository,
                              HistoricoSolicitacaoRepository historicoRepository,
                              ClientService clientService,
                              CategoryService categoryService,
                              EmployeeService employeeService) {
        this.solicitacaoRepository = solicitacaoRepository;
        this.historicoRepository = historicoRepository;
        this.clientService = clientService;
        this.categoryService = categoryService;
        this.employeeService = employeeService;
    }

    // RF004 - Abrir solicitação
    @Transactional
    public Solicitacao abrirSolicitacao(Long clienteId, SolicitacaoCreateDTO dto) {
        Client cliente = clientService.buscarPorId(clienteId);
        Category categoria = categoryService.buscarPorId(dto.getCategoriaId());

        Solicitacao solicitacao = Solicitacao.builder()
                .dataHoraAbertura(LocalDateTime.now())
                .descricaoEquipamento(dto.getDescricaoEquipamento())
                .categoriaEquipamento(categoria)
                .descricaoDefeito(dto.getDescricaoDefeito())
                .estado(EstadoSolicitacao.ABERTA)
                .cliente(cliente)
                .build();

        Solicitacao salva = solicitacaoRepository.save(solicitacao);
        registrarHistorico(salva, EstadoSolicitacao.ABERTA, null, null, "Solicitação criada pelo cliente.");
        return salva;
    }

    // RF003 - Listar solicitações por cliente
    public List<Solicitacao> listarPorCliente(Long clienteId) {
        return solicitacaoRepository.findByClienteId(clienteId);
    }

    // RF011 - Listar solicitações abertas
    public List<Solicitacao> listarAbertas() {
        return solicitacaoRepository.findByEstado(EstadoSolicitacao.ABERTA);
    }

    // RF013 - Listagem geral
    public List<Solicitacao> listarTodas() {
        return solicitacaoRepository.findAll();
    }

    public Solicitacao buscarPorId(Long id) {
        return solicitacaoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Solicitação não encontrada."));
    }

    // RF012 - Efetuar orçamento
    @Transactional
    public Solicitacao efetuarOrcamento(Long solicitacaoId, OrcamentoDTO dto) {
        Solicitacao s = buscarPorId(solicitacaoId);
        if (s.getEstado() != EstadoSolicitacao.ABERTA) {
            throw new IllegalStateException("A solicitação não está no estado ABERTA.");
        }

        Employee funcionario = employeeService.buscarPorId(dto.getFuncionarioId());

        s.setValorOrcamento(dto.getValor());
        s.setDataHoraOrcamento(LocalDateTime.now());
        s.setFuncionarioOrcamento(funcionario);
        s.setEstado(EstadoSolicitacao.ORCADA);

        registrarHistorico(s, EstadoSolicitacao.ORCADA, funcionario, null, "Orçamento efetuado: R$ " + dto.getValor());
        return solicitacaoRepository.save(s);
    }

    // RF006 - Aprovar Serviço
    @Transactional
    public Solicitacao aprovarServico(Long solicitacaoId) {
        Solicitacao s = buscarPorId(solicitacaoId);
        if (s.getEstado() != EstadoSolicitacao.ORCADA) {
            throw new IllegalStateException("A solicitação não está no estado ORÇADA.");
        }

        s.setEstado(EstadoSolicitacao.APROVADA);
        registrarHistorico(s, EstadoSolicitacao.APROVADA, null, null, "Aprovado pelo cliente.");
        return solicitacaoRepository.save(s);
    }

    // RF007 - Rejeitar Serviço
    @Transactional
    public Solicitacao rejeitarServico(Long solicitacaoId, String motivo) {
        Solicitacao s = buscarPorId(solicitacaoId);
        if (s.getEstado() != EstadoSolicitacao.ORCADA) {
            throw new IllegalStateException("A solicitação não está no estado ORÇADA.");
        }

        s.setMotivoRejeicao(motivo);
        s.setEstado(EstadoSolicitacao.REJEITADA);
        registrarHistorico(s, EstadoSolicitacao.REJEITADA, null, null, "Rejeitado pelo cliente: " + motivo);
        return solicitacaoRepository.save(s);
    }

    // RF009 - Resgatar Serviço
    @Transactional
    public Solicitacao resgatarServico(Long solicitacaoId) {
        Solicitacao s = buscarPorId(solicitacaoId);
        if (s.getEstado() != EstadoSolicitacao.REJEITADA) {
            throw new IllegalStateException("Somente solicitações REJEITADAS podem ser resgatadas.");
        }

        s.setEstado(EstadoSolicitacao.APROVADA);
        registrarHistorico(s, EstadoSolicitacao.APROVADA, null, null, "Serviço resgatado do estado Rejeitado para Aprovado.");
        return solicitacaoRepository.save(s);
    }

    // RF014 - Efetuar Manutenção
    @Transactional
    public Solicitacao efetuarManutencao(Long solicitacaoId, ManutencaoDTO dto) {
        Solicitacao s = buscarPorId(solicitacaoId);
        if (s.getEstado() != EstadoSolicitacao.APROVADA && s.getEstado() != EstadoSolicitacao.REDIRECIONADA) {
            throw new IllegalStateException("A solicitação deve estar APROVADA ou REDIRECIONADA.");
        }

        Employee funcionario = employeeService.buscarPorId(dto.getFuncionarioId());

        s.setDescricaoManutencao(dto.getDescricaoManutencao());
        s.setOrientacoesCliente(dto.getOrientacoesCliente());
        s.setDataHoraManutencao(LocalDateTime.now());
        s.setFuncionarioManutencao(funcionario);
        s.setEstado(EstadoSolicitacao.ARRUMADA);

        registrarHistorico(s, EstadoSolicitacao.ARRUMADA, funcionario, null, "Manutenção efetuada.");
        return solicitacaoRepository.save(s);
    }

    // RF015 - Redirecionar Manutenção
    @Transactional
    public Solicitacao redirecionarManutencao(Long solicitacaoId, RedirecionamentoDTO dto) {
        if (dto.getFuncionarioOrigemId().equals(dto.getFuncionarioDestinoId())) {
            throw new IllegalArgumentException("Uma solicitação não pode ser redirecionada para si mesmo.");
        }

        Solicitacao s = buscarPorId(solicitacaoId);
        if (s.getEstado() != EstadoSolicitacao.APROVADA && s.getEstado() != EstadoSolicitacao.REDIRECIONADA) {
            throw new IllegalStateException("A solicitação deve estar APROVADA ou REDIRECIONADA para ser redirecionada.");
        }

        Employee origem = employeeService.buscarPorId(dto.getFuncionarioOrigemId());
        Employee destino = employeeService.buscarPorId(dto.getFuncionarioDestinoId());

        s.setFuncionarioDestino(destino);
        s.setEstado(EstadoSolicitacao.REDIRECIONADA);

        registrarHistorico(s, EstadoSolicitacao.REDIRECIONADA, origem, destino, "Solicitação redirecionada.");
        return solicitacaoRepository.save(s);
    }

    // RF010 - Pagar Serviço
    @Transactional
    public Solicitacao pagarServico(Long solicitacaoId) {
        Solicitacao s = buscarPorId(solicitacaoId);
        if (s.getEstado() != EstadoSolicitacao.ARRUMADA) {
            throw new IllegalStateException("A solicitação precisa estar no estado ARRUMADA para ser paga.");
        }

        s.setDataHoraPagamento(LocalDateTime.now());
        s.setEstado(EstadoSolicitacao.PAGA);

        registrarHistorico(s, EstadoSolicitacao.PAGA, null, null, "Pagamento efetuado pelo cliente.");
        return solicitacaoRepository.save(s);
    }

    // RF016 - Finalizar Solicitação
    @Transactional
    public Solicitacao finalizarSolicitacao(Long solicitacaoId, Long funcionarioId) {
        Solicitacao s = buscarPorId(solicitacaoId);
        if (s.getEstado() != EstadoSolicitacao.PAGA) {
            throw new IllegalStateException("A solicitação precisa estar no estado PAGA para ser finalizada.");
        }

        Employee funcionario = employeeService.buscarPorId(funcionarioId);

        s.setEstado(EstadoSolicitacao.FINALIZADA);
        registrarHistorico(s, EstadoSolicitacao.FINALIZADA, funcionario, null, "Solicitação finalizada.");
        return solicitacaoRepository.save(s);
    }

    private void registrarHistorico(Solicitacao solicitacao, EstadoSolicitacao estado,
                                     Employee origem, Employee destino, String observacao) {
        HistoricoSolicitacao h = HistoricoSolicitacao.builder()
                .dataHora(LocalDateTime.now())
                .estado(estado)
                .funcionario(origem)
                .funcionarioDestino(destino)
                .observacao(observacao)
                .solicitacao(solicitacao)
                .build();
        solicitacao.getHistorico().add(h);
    }
}
