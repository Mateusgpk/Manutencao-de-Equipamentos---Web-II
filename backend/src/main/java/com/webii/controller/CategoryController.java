package com.webii.controller;

import com.webii.entity.Category;
import com.webii.repository.CategoryRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:4200")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public List<Category> getAll() {
        return categoryRepository.findByAtivoTrueOrderByNameAsc();
    }

    @GetMapping("/{id}")
    public Category getById(@PathVariable Long id) {
        return categoryRepository.findByIdAndAtivoTrue(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Categoria não encontrada."));
    }

    @PostMapping
    public ResponseEntity<Category> create(@Valid @RequestBody Category category) {
        String name = category.getName().trim();

        if (categoryRepository.existsByNameIgnoreCase(name)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Categoria já cadastrada.");
        }

        category.setId(null);
        category.setName(name);
        category.setAtivo(true);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(categoryRepository.save(category));
    }

    @PutMapping("/{id}")
    public Category update(@PathVariable Long id, @Valid @RequestBody Category updated) {
        Category existing = categoryRepository.findByIdAndAtivoTrue(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Categoria não encontrada."));

        String name = updated.getName().trim();

        if (categoryRepository.existsByNameIgnoreCaseAndIdNot(name, id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Já existe outra categoria com esse nome.");
        }

        existing.setName(name);
        return categoryRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Category existing = categoryRepository.findByIdAndAtivoTrue(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Categoria não encontrada."));

        existing.setAtivo(false);
        categoryRepository.save(existing);

        return ResponseEntity.noContent().build();
    }
}