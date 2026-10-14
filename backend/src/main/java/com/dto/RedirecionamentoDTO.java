package com.webii.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RedirecionamentoDTO {
    @NotNull private Long funcionarioOrigemId;
    @NotNull private Long funcionarioDestinoId;
}
