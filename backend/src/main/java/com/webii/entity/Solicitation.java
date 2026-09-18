package com.webii.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_solicitation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Solicitation {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  // --- Cliente ---
  @NotNull(message = "O ID do cliente é obrigatório")
  @Column(nullable = false)
  private Long clientId;

  @Column(length = 150)
  private String clientName;

  // --- Equipamento e Defeito ---
  @NotBlank(message = "A descrição do equipamento é obrigatória")
  @Column(nullable = false, columnDefinition = "TEXT")
  private String equipmentDescription;

  @NotNull(message = "A categoria é obrigatória")
  private Long categoryId;

  @Column(length = 100)
  private String categoryName;

  @NotBlank(message = "A descrição do defeito é obrigatória")
  @Column(nullable = false, columnDefinition = "TEXT")
  private String defectDescription;

  // --- Status e Datas Gerais ---
  @NotNull(message = "O status é obrigatório")
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private RequestStatus status;

  @NotNull(message = "A data de abertura é obrigatória")
  @Column(nullable = false)
  private LocalDateTime openedAt;

  private LocalDateTime paidAt;

  // --- Orçamento ---
  private BigDecimal quoteValue;
  private Long quotedByEmployeeId;

  @Column(length = 150)
  private String quotedByEmployeeName;
  private LocalDateTime quotedAt;

  @Column(columnDefinition = "TEXT")
  private String rejectionReason;

  // --- Manutenção ---
  @Column(columnDefinition = "TEXT")
  private String maintenanceDescription;

  @Column(columnDefinition = "TEXT")
  private String clientOrientations;

  private Long maintainedByEmployeeId;

  @Column(length = 150)
  private String maintainedByEmployeeName;
  private LocalDateTime maintainedAt;

  // --- Redirecionamento ---
  private Long redirectedToEmployeeId;

  @Column(length = 150)
  private String redirectedToEmployeeName;

  // --- Finalização ---
  private Long finalizedByEmployeeId;

  @Column(length = 150)
  private String finalizedByEmployeeName;
  private LocalDateTime finalizedAt;

  // --- Histórico ---
  @ElementCollection(fetch = FetchType.LAZY)
  @CollectionTable(name = "tb_solicitation_history", joinColumns = @JoinColumn(name = "solicitation_id"))
  @OrderColumn(name = "history_index")
  @Builder.Default
  private List<HistoryEntry> history = new ArrayList<>();
}
