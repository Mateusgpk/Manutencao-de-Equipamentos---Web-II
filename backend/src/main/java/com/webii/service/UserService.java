package com.webii.service;

import com.webii.entity.User;
import com.webii.enums.Role;
import com.webii.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User autenticar(String email, String senha) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário ou senha inválidos."));

        if (!verificarSenha(senha, user.getPassword())) {
            throw new IllegalArgumentException("Usuário ou senha inválidos.");
        }
        return user;
    }

    public List<User> listarTodos(){
        return userRepository.findAll();
    }
    public User encontrarPorId(long id){
        Optional<User> usuario = userRepository.findByUserId(id);
        if (usuario.isEmpty()){
            return usuario.get();
        }else {
            return null;
        }
    }

    public String gerarSenhaAleatoria() {
        Random random = new Random();
        int numero = 1000 + random.nextInt(9000);
        return String.valueOf(numero);
    }

    public String hashSenhaComSalt(String senha) {
        try {
            SecureRandom random = new SecureRandom();
            byte[] salt = new byte[16];
            random.nextBytes(salt);

            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(salt);
            byte[] hashedPassword = md.digest(senha.getBytes());

            String saltBase64 = Base64.getEncoder().encodeToString(salt);
            String hashBase64 = Base64.getEncoder().encodeToString(hashedPassword);

            return saltBase64 + ":" + hashBase64;
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Erro ao criptografar senha", e);
        }
    }

    public boolean verificarSenha(String senhaDigitada, String hashArmazenado) {
        try {
            String[] parts = hashArmazenado.split(":");
            if (parts.length != 2) return false;

            byte[] salt = Base64.getDecoder().decode(parts[0]);
            byte[] hashOriginal = Base64.getDecoder().decode(parts[1]);

            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(salt);
            byte[] hashCalculado = md.digest(senhaDigitada.getBytes());

            return MessageDigest.isEqual(hashOriginal, hashCalculado);
        } catch (Exception e) {
            return false;
        }
    }

    public User criarUsuario(User usuario) {
        if (userRepository.existsByEmail(usuario.getEmail())) {
            throw new IllegalArgumentException("E-mail já cadastrado.");
        }
        return userRepository.save(usuario);
    }

    public User editarUsuario(User usuario, long id){
        usuario.setId(id);
        User editado = userRepository.save(usuario);
        return editado;
    }

    public boolean deletar(long id){
        Optional<User> usuario = userRepository.findByUserId(id);
        if (!usuario.isEmpty()) {
            usuario.get().setAtivo(false);
            return true;
        }
        return false;
    }
}
