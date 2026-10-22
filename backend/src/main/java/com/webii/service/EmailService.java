package com.webii.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void enviarSenhaAutocadastro(String emailDestino, String senhaGerada) {
        System.out.println("==================================================");
        System.out.println("E-mail enviado para: " + emailDestino);
        System.out.println("Sua senha de acesso é: " + senhaGerada);
        System.out.println("==================================================");
    }
}
