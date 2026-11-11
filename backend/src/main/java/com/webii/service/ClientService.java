package com.webii.service;

import com.webii.dto.AutoCadastroDTO;
import com.webii.dto.ViaCepResponseDTO;
import com.webii.entity.Client;
import com.webii.entity.User;
import com.webii.enums.Role;
import com.webii.repository.ClientRepository;
import com.webii.util.CpfUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class ClientService {

    private final ClientRepository clientRepository;
    private final UserService userService;
    private final ViaCepService viaCepService;
    private final EmailService emailService;

    public ClientService(ClientRepository clientRepository, UserService userService,
                         ViaCepService viaCepService, EmailService emailService) {
        this.clientRepository = clientRepository;
        this.userService = userService;
        this.viaCepService = viaCepService;
        this.emailService = emailService;
    }

    @Transactional
    public Client autocadastro(AutoCadastroDTO dto) {
        String cpf = dto.getCpf().replaceAll("\\D", "");
        String cep = dto.getCep().replaceAll("\\D", "");
        if (!CpfUtil.valido(cpf)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "CPF inválido.");
        }
        if (clientRepository.existsByCpf(cpf)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "CPF já cadastrado.");
        }
        System.out.println(dto);
        ViaCepResponseDTO enderecoViaCep = viaCepService.buscarEnderecoPorCep(cep);
        String endereco = preencher(dto.getEndereco(), enderecoViaCep.getLogradouro(), "endereço");
        String bairro = preencher(dto.getBairro(), enderecoViaCep.getBairro(), "bairro");
        String cidade = preencher(dto.getCidade(), enderecoViaCep.getLocalidade(), "cidade");
        String estado = preencher(dto.getEstado(), enderecoViaCep.getUf(), "estado");
        String senhaPlana = userService.gerarSenhaAleatoria();
        System.out.println(senhaPlana);
        User user;
        try {
            user = userService.criarUsuario(dto.getEmail().trim(), senhaPlana, Role.CLIENTE);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage(), ex);
        }

        Client cliente = Client.builder()
                .name(dto.getName().trim())
                .cpf(cpf)
                .telefone(dto.getTelefone().trim())
                .cep(cep)
                .endereco(endereco)
                .bairro(bairro)
                .cidade(cidade)
                .estado(estado)
                .numero(dto.getNumero().trim())
                .complemento(dto.getComplemento() == null ? null : dto.getComplemento().trim())
                .user(user)
                .build();
        System.out.println(cliente);
        Client salvo = clientRepository.save(cliente);
        System.out.println(salvo);
        emailService.enviarSenhaAutocadastro(dto.getEmail().trim(), senhaPlana);
        return salvo;
    }

    private String preencher(String informado, String viaCep, String campo) {
        String valor = informado != null && !informado.isBlank() ? informado : viaCep;
        if (valor == null || valor.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe o " + campo + " do endereço.");
        }
        return valor.trim();
    }

    public List<Client> listarTodos(){
        return clientRepository.findAll();
    }

    public Client buscarPorId(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado."));
    }

    public Client buscarPorUserId(Long userId) {
        return clientRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado para este usuário."));
    }
    public Client deletar(long userId){
        Optional<Client> cliete= clientRepository.findByUserId(userId);
        if (!cliete.isEmpty()){
            cliete.get().getUser().setAtivo(false);
            return cliete.get();
        }
        return null;
    }
}
