package com.webii.service;

import com.webii.dto.AutoCadastroDTO;
import com.webii.dto.ViaCepResponseDTO;
import com.webii.entity.Client;
import com.webii.entity.User;
import com.webii.enums.Role;
import com.webii.repository.ClientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        if (clientRepository.existsByCpf(dto.getCpf())) {
            throw new IllegalArgumentException("CPF já cadastrado.");
        }

        ViaCepResponseDTO enderecoViaCep = viaCepService.buscarEnderecoPorCep(dto.getCep());
        String senhaPlana = userService.gerarSenhaAleatoria();
        User user = userService.criarUsuario(dto.getEmail(), senhaPlana, Role.CLIENTE);

        Client cliente = Client.builder()
                .name(dto.getName())
                .cpf(dto.getCpf())
                .telefone(dto.getTelefone())
                .cep(dto.getCep())
                .endereco(enderecoViaCep.getLogradouro())
                .bairro(enderecoViaCep.getBairro())
                .cidade(enderecoViaCep.getLocalidade())
                .estado(enderecoViaCep.getUf())
                .numero(dto.getNumero())
                .complemento(dto.getComplemento())
                .user(user)
                .build();

        Client salvo = clientRepository.save(cliente);
        emailService.enviarSenhaAutocadastro(dto.getEmail(), senhaPlana);
        return salvo;
    }

    public Client buscarPorId(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado."));
    }

    public Client buscarPorUserId(Long userId) {
        return clientRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado para este usuário."));
    }
}
