package com.webii.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "tb_employee_profile")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeProfile {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long idProfile;

  @NotNull(message = "Informe o usuário vinculado ao perfil.")
  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id_user", nullable = false, unique = true)
  private User user;

  @NotBlank(message = "Informe o departamento.")
  @Column(nullable = false, length = 100)
  private String department;

  @NotBlank(message = "Informe ao menos uma especialidade.")
  @Column(nullable = false, columnDefinition = "TEXT")
  private String specialties;

  @NotNull(message = "Informe a data de admissão.")
  @Column(nullable = false)
  private LocalDate admissionDate;

  @Column(nullable = true)
  private LocalDate resignationDate;

  @Builder.Default
  @NotNull(message = "Indique se o perfil está ativo.")
  @Column(nullable = false)
  private Boolean active = true;

  @Builder.Default
  @NotNull(message = "Defina a permissão para cotações.")
  @Column(nullable = false)
  private Boolean canQuote = false;

  @Builder.Default
  @NotNull(message = "Defina a permissão para manutenções.")
  @Column(nullable = false)
  private Boolean canMaintain = false;

  @Builder.Default
  @NotNull(message = "Defina a permissão para finalizações.")
  @Column(nullable = false)
  private Boolean canFinalize = false;

  @Builder.Default
  @NotNull(message = "Defina a permissão para visualização de relatórios.")
  @Column(nullable = false)
  private Boolean canViewReports = false;

  @Column(nullable = true, length = 500)
  private String observations;

  @Column(nullable = false, updatable = false)
  private LocalDate createdAt;

  @Column(nullable = false)
  private LocalDate updatedAt;

  @PrePersist
  protected void onCreate() {
    LocalDate now = LocalDate.now();
    this.createdAt = now;
    this.updatedAt = now;
    if (this.active == null) {
      this.active = true;
    }
  }

  @PreUpdate
  protected void onUpdate() {
    this.updatedAt = LocalDate.now();
  }

  public boolean isActiveEmployee() {
    return Boolean.TRUE.equals(this.active) && this.resignationDate == null;
  }

  /**
   * Avalia se o colaborador está inativo ou desligado da empresa.
   *
   * @return true se o perfil constar como inativo ou possuir data de desligamento
   */
  public boolean isInactiveOrFired() {
    return !isActiveEmployee();
  }
}
