package com.webii.dto;

import lombok.Data;

@Data
public class ViaCepResponseDTO {
    private String logradouro;
    private String bairro;
    private String localidade;
    private String uf;
    private Boolean erro;   
}
