package com.webii.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AutoCadastroDTO {
    @NotBlank @Size(min = 3, max = 120) private String name;

    @NotBlank @Pattern(regexp = "^(\\d{11}|\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2})$")
    private String cpf;

    @NotBlank @Email @Size(max = 254) private String email;

    @NotBlank @Pattern(regexp = "^\\(?\\d{2}\\)?\\s?9\\d{4}-?\\d{4}$")
    private String telefone;

    @NotBlank @Pattern(regexp = "^\\d{5}-?\\d{3}$") private String cep;

    @NotBlank @Size(max = 20) private String numero
    @Size(max = 120) private String complemento;
    @Size(max = 255) private String endereco;
    @Size(max = 120) private String bairro;
    @Size(max = 120) private String cidade;
    @Size(max = 2) private String estado;
}