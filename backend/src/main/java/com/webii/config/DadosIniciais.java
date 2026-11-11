package com.webii.config;

import com.webii.entity.*;
import com.webii.enums.EstadoSolicitacao;
import com.webii.enums.Role;
import com.webii.repository.CategoryRepository;
import com.webii.repository.ClientRepository;
import com.webii.repository.EmployeeRepository;
import com.webii.repository.SolicitacaoRepository;
import com.webii.util.PasswordUtil;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import static com.webii.enums.EstadoSolicitacao.*;

@Component
public class DadosIniciais implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;
    private final ClientRepository clientRepository;
    private final CategoryRepository categoryRepository;
    private final SolicitacaoRepository solicitacaoRepository;

    public DadosIniciais(EmployeeRepository employeeRepository,
                         ClientRepository clientRepository,
                         CategoryRepository categoryRepository,
                         SolicitacaoRepository solicitacaoRepository) {
        this.employeeRepository = employeeRepository;
        this.clientRepository = clientRepository;
        this.categoryRepository = categoryRepository;
        this.solicitacaoRepository = solicitacaoRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // se já tem categoria, o banco já foi populado
        if (categoryRepository.count() > 0) {
            return;
        }

        Category notebook = novaCategoria("Notebook");
        Category desktop = novaCategoria("Desktop");
        Category impressora = novaCategoria("Impressora");
        Category mouse = novaCategoria("Mouse");
        Category teclado = novaCategoria("Teclado");
        Employee maria = novoFuncionario("Maria", "maria@a", LocalDate.of(1990, 5, 10));
        Employee mario = novoFuncionario("Mário", "mario@a", LocalDate.of(1988, 3, 2));
        novoFuncionario("opa", "opa@a", LocalDate.of(2000, 2, 24));
        novoFuncionario("roberto", "roberto@a", LocalDate.of(1995, 6, 21));
        novoFuncionario("larisso", "pumaa@aaaaa", LocalDate.of(1998, 10, 4));
        Client joao = novoCliente("João", "12345678909", "joao@a", "(41) 91234-5678");
        Client jose = novoCliente("José", "98765432100", "jose@a", "(41) 98765-4321");
        Client joana = novoCliente("Joana", "11144477735", "joana@a", "(41) 90874-5464");
        Client joaquina = novoCliente("Joaquina", "52998224725", "joaquina@a", "(41) 99111-2233");
        Client rapaiz = novoCliente("rapaiz", "11375659936", "a@a", "(41) 99664-1322");

        String hoje = LocalDate.now() + "T09:00";

        // abertas
        criar(jose, impressora, "Impressora HP LaserJet", "2026-08-20T09:15", null, null, null, null, ABERTA);
        criar(joao, mouse, "Mouse Logitech G203", "2026-09-14T20:15", null, null, null, null, ABERTA);
        criar(joaquina, teclado, "Teclado Redragon Kumara", hoje, null, null, null, null, ABERTA);
        // orcadas
        criar(joao, notebook, "Notebook Dell Inspiron 15", "2026-08-10T09:15", "350.90", null, maria, null, ORCADA);
        criar(joana, mouse, "Mouse Microsoft Sem Fio", "2026-10-02T14:00", "45", null, mario, null, ORCADA);
        // rejeitadas
        criar(jose, desktop, "Desktop Positivo Master", "2026-09-01T10:00", "900", null, maria, null, REJEITADA);
        criar(joaquina, impressora, "Impressora Epson L3250", "2026-10-10T11:30", "300", null, mario, null, REJEITADA);
        // aprovadas
        criar(joana, desktop, "Desktop Dell Optiplex", "2026-09-16T10:00", "60", null, mario, null, APROVADA);
        criar(rapaiz, notebook, "Notebook Asus VivoBook", "2026-10-05T16:20", "120", null, maria, null, APROVADA);
        // redirecionadas 
        criar(joao, notebook, "Notebook Acer Aspire A515", "2026-09-20T11:00", "250", null, maria, mario, REDIRECIONADA);
        criar(jose, impressora, "Impressora Brother DCP", "2026-10-12T08:40", "130", null, mario, maria, REDIRECIONADA);
        // arrumadas
        criar(joao, impressora, "Impressora HP DeskJet", "2026-09-18T08:30", "180.50", null, mario, null, ARRUMADA);
        criar(rapaiz, teclado, "Teclado Mecânico Redragon", "2026-10-15T13:10", "70", null, maria, null, ARRUMADA);
        // pagas
        criar(joana, desktop, "Desktop Lenovo ThinkCentre", "2026-08-12T10:30", "420", "2026-08-14T16:20", maria, null, PAGA);
        criar(joana, notebook, "Notebook Samsung Book", "2026-08-12T15:00", "200", "2026-08-14T10:30", maria, null, PAGA);
        criar(joao, teclado, "Teclado Logitech K120", "2026-08-15T08:45", "95", "2026-08-16T11:05", mario, null, PAGA);
        criar(joaquina, mouse, "Mouse Logitech MX", "2026-10-18T09:00", "60", "2026-10-20T10:00", mario, null, PAGA);
        // finalizadas
        criar(jose, notebook, "Notebook Lenovo ThinkPad", "2026-09-05T09:15", "75.90", "2026-09-12T16:09", maria, null, FINALIZADA);
        criar(rapaiz, desktop, "Desktop HP ProDesk", "2026-09-08T10:00", "310", "2026-09-12T10:00", mario, null, FINALIZADA);
        criar(joaquina, notebook, "Notebook Acer Nitro", "2026-10-17T15:00", "500", "2026-10-20T15:00", maria, null, FINALIZADA);
        criar(joao, mouse, "Mouse Razer DeathAdder", "2026-10-30T09:30", "35", "2026-11-03T09:00", mario, null, FINALIZADA);
        criar(jose, teclado, "Teclado Corsair K55", "2026-10-31T10:30", "80", "2026-11-03T14:00", maria, null, FINALIZADA);
    }

    private Category novaCategoria(String nome) {
        Category c = new Category();
        c.setName(nome);
        c.setAtivo(true);
        return categoryRepository.save(c);
    }

    private Employee novoFuncionario(String nome, String email, LocalDate nascimento) {
        User user = User.builder()
                .email(email)
                .password(PasswordUtil.hashSenhaComSalt("123456"))
                .role(Role.FUNCIONARIO)
                .ativo(true)
                .build();

        Employee f = new Employee();
        f.setName(nome);
        f.setDataNascimento(nascimento);
        f.setUser(user);
        return employeeRepository.save(f); // o cascade salva o user junto
    }

    private Client novoCliente(String nome, String cpf, String email, String telefone) {
        User user = User.builder()
                .email(email)
                .password(PasswordUtil.hashSenhaComSalt("123456"))
                .role(Role.CLIENTE)
                .ativo(true)
                .build();

        Client c = new Client();
        c.setName(nome);
        c.setCpf(cpf);
        c.setTelefone(telefone);
        c.setCep("83702100");
        c.setEndereco("Rua Julia Theresa Bini");
        c.setNumero("100");
        c.setBairro("Centro");
        c.setCidade("Araucária");
        c.setEstado("PR");
        c.setUser(user);
        return clientRepository.save(c);
    }

    private void criar(Client cliente, Category categoria, String equipamento, String abertura,
                       String valor, String pagamento, Employee func, Employee destino, EstadoSolicitacao fim) {

        LocalDateTime dataAbertura = LocalDateTime.parse(abertura);

        Solicitacao s = Solicitacao.builder()
                .cliente(cliente)
                .categoriaEquipamento(categoria)
                .descricaoEquipamento(equipamento)
                .descricaoDefeito("Defeito de teste: " + equipamento + " não funciona direito.")
                .dataHoraAbertura(dataAbertura)
                .estado(fim)
                .build();

        // todos começam abertos
        historico(s, ABERTA, dataAbertura, null, null, "Solicitação aberta.");

        boolean orcou = fim != ABERTA;
        boolean rejeitou = fim == REJEITADA;
        boolean aprovou = fim == APROVADA || fim == REDIRECIONADA || fim == ARRUMADA || fim == PAGA || fim == FINALIZADA;
        boolean redirecionou = fim == REDIRECIONADA;
        boolean arrumou = fim == ARRUMADA || fim == PAGA || fim == FINALIZADA;
        boolean pagou = fim == PAGA || fim == FINALIZADA;
        boolean finalizou = fim == FINALIZADA;

        if (orcou) {
            LocalDateTime quando = dataAbertura.plusHours(3);
            s.setValorOrcamento(new BigDecimal(valor));
            s.setDataHoraOrcamento(quando);
            s.setFuncionarioOrcamento(func);
            historico(s, ORCADA, quando, func, null, "Orçamento registrado.");
        }

        if (rejeitou) {
            String motivo = "Valor acima do esperado.";
            s.setMotivoRejeicao(motivo);
            historico(s, REJEITADA, dataAbertura.plusHours(6), null, null, motivo);
        }

        if (aprovou) {
            historico(s, APROVADA, dataAbertura.plusHours(6), null, null, "Serviço aprovado pelo cliente.");
        }

        if (redirecionou) {
            s.setFuncionarioDestino(destino);
            historico(s, REDIRECIONADA, dataAbertura.plusHours(9), func, destino,
                    "Redirecionada de " + func.getName() + " para " + destino.getName() + ".");
        }

        if (arrumou) {
            LocalDateTime quando = dataAbertura.plusHours(9);
            s.setDescricaoManutencao("Manutenção realizada (dado de teste).");
            s.setOrientacoesCliente("Evite o mesmo defeito (dado de teste).");
            s.setDataHoraManutencao(quando);
            s.setFuncionarioManutencao(func);
            historico(s, ARRUMADA, quando, func, null, "Manutenção realizada.");
        }

        if (pagou) {
            LocalDateTime quando = LocalDateTime.parse(pagamento);
            s.setDataHoraPagamento(quando);
            historico(s, PAGA, quando, null, null, "Pagamento confirmado.");
        }

        if (finalizou) {
            LocalDateTime quando = LocalDateTime.parse(pagamento).plusDays(1);
            historico(s, FINALIZADA, quando, func, null, "Solicitação finalizada.");
        }

        solicitacaoRepository.save(s); 
    }

    private void historico(Solicitacao s, EstadoSolicitacao estado, LocalDateTime dataHora, Employee func, Employee destino, String obs) {
        HistoricoSolicitacao h = new HistoricoSolicitacao();
        h.setSolicitacao(s);
        h.setEstado(estado);
        h.setDataHora(dataHora);
        h.setFuncionario(func);
        h.setFuncionarioDestino(destino);
        h.setObservacao(obs);
        s.getHistorico().add(h);
    }
}