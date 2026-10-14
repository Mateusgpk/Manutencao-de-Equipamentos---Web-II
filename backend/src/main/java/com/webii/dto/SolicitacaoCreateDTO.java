package com.webii.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SolicitacaoCreateDTO {
    @NotBlank private String descricaoEquipamento;
    @NotNull private Long categoriaId;
    @NotBlank private String descricaoDefeito;
}
