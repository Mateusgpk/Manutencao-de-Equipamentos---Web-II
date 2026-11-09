package com.webii.service;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final ObjectProvider<JavaMailSender> mailSender;
    private final String host;
    private final String remetente;

    public EmailService(ObjectProvider<JavaMailSender> mailSender,
                        @Value("${MAIL_HOST:}") String host,
                        @Value("${app.mail.from:}") String remetente) {
        this.mailSender = mailSender;
        this.host = host;
        this.remetente = remetente;
    }

    public void enviarSenhaAutocadastro(String emailDestino, String senhaGerada) {
        if (host.isBlank() || remetente.isBlank()) {
            throw new IllegalStateException("Configure MAIL_HOST e MAIL_FROM para habilitar o autocadastro.");
        }
        JavaMailSender sender = mailSender.getIfAvailable();
        if (sender == null) {
            throw new IllegalStateException("O serviço de e-mail não está configurado.");
        }

        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setFrom(remetente);
        mensagem.setTo(emailDestino);
        mensagem.setSubject("Senha de acesso - Manutenção de Equipamentos");
        mensagem.setText("Sua senha de acesso é: " + senhaGerada
                + "\nUse seu e-mail para entrar no sistema.");
        try {
            sender.send(mensagem);
        } catch (MailException ex) {
            throw new IllegalStateException("Não foi possível enviar a senha por e-mail.", ex);
        }
    }
}
