package com.webii.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AutocadastroDTO {
    @NotBlank private String name;
    @NotBlank private String cpf;
    @NotBlank @Email private String email;
    @NotBlank private String telefone;
    @NotBlank private String cep;
    @NotBlank private String numero;
    private String complemento;
}
