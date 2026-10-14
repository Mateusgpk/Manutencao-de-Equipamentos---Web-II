package com.webii.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class ReceitaDiaDTO {
    private LocalDate data;
    private BigDecimal total;
}
