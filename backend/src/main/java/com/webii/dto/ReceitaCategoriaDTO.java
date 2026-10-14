package com.webii.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class ReceitaCategoriaDTO {
    private String categoria;
    private BigDecimal total;
}
