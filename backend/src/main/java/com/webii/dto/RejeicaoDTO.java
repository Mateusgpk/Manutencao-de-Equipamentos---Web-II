package com.webii.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RejeicaoDTO {
   @NotBlank 
   private String motivo; 
}
