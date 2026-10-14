package com.webii.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ManutencaoDTO {
    @NotBlank private String descricaoManutencao;
    @NotBlank private String orientacoesCliente;
    @NotNull private Long funcionarioId;
}
