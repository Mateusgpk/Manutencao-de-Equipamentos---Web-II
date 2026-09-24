package com.webii.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "equipamentos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Equipamento {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String descricao;

  @Column(nullable = false)
  private String categoria;

  @OneToMany(mappedBy = "equipamento")
  private List<Solicitacao> solicitacoes;
}
