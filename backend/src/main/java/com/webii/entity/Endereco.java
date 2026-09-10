package com.webii.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class Endereco {

  @Column(name = "Cep", length = 9)
  @JsonProperty("Cep")
  private String cep;

  @Column(name = "Rua", length = 120)
  @JsonProperty("Rua")
  private String rua;

  @Column(name = "Numero", length = 10)
  @JsonProperty("Numero")
  private String numero;

  @Column(name = "Bairro", length = 80)
  @JsonProperty("Bairro")
  private String bairro;

  @Column(name = "Cidade", length = 80)
  @JsonProperty("Cidade")
  private String cidade;

  @Column(name = "Estado", length = 2)
  @JsonProperty("Estado")
  private String estado;

  @Column(name = "Complemento")
  @JsonProperty("Complemento")
  private String complemento;

}
