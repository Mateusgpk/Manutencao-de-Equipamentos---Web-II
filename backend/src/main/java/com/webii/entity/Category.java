public
package com.webii.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "categories")
public class Category {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  @Column(unique = true, nullable = false)
  private String name;

  @Column(nullable = false)
  private Boolean active = true;

  public Category() {
  }

  public Category(String name) {
    this.name = name;
    this.active = true;
  }
}
