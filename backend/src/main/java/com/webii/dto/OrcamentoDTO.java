package com.webii.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrcamentoDTO {

    @NotNull
    private Long funcionarioId;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal valor;
}