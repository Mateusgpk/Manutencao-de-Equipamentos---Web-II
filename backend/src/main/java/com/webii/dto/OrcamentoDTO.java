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
    @DecimalMin(value = "0.01", message = "O valor do orçamento deve ser maior que zero.")
    private BigDecimal valor;
}