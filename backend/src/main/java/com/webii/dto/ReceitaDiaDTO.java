package com.webii.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ReceitaDiaDTO(LocalDate dia, Long quantidade, BigDecimal total) {}