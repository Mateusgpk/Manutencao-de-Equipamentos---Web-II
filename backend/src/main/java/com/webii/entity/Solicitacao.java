package com.webii.entity;

import com.webii.enums.EstadoSolicitacao;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_solicitacao")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Solicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_hora_abertura", nullable = false)
    private LocalDateTime dataHoraAbertura;

    @Column(name = "descricao_equipamento", nullable = false)
    private String descricaoEquipamento;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Category categoriaEquipamento;

    @Column(name = "descricao_defeito", nullable = false, columnDefinition = "TEXT")
    private String descricaoDefeito;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoSolicitacao estado;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Client cliente;

    @Column(name = "valor_orcamento")
    private BigDecimal valorOrcamento;

    @Column(name = "data_hora_orcamento")
    private LocalDateTime dataHoraOrcamento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "funcionario_orcamento_id")
    private Employee funcionarioOrcamento;

    @Column(name = "motivo_rejeicao", columnDefinition = "TEXT")
    private String motivoRejeicao;

    @Column(name = "data_hora_pagamento")
    private LocalDateTime dataHoraPagamento;

    @Column(name = "descricao_manutencao", columnDefinition = "TEXT")
    private String descricaoManutencao;

    @Column(name = "orientacoes_cliente", columnDefinition = "TEXT")
    private String orientacoesCliente;

    @Column(name = "data_hora_manutencao")
    private LocalDateTime dataHoraManutencao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "funcionario_manutencao_id")
    private Employee funcionarioManutencao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "funcionario_destino_id")
    private Employee funcionarioDestino;

    @OneToMany(mappedBy = "solicitacao", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("dataHora ASC")
    @Builder.Default
    private List<HistoricoSolicitacao> historico = new ArrayList<>();
}
