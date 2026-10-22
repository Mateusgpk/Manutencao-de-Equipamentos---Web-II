package com.webii.service;

import com.webii.entity.Category;
import com.webii.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Category criar(String name) {
        if (categoryRepository.existsByName(name)) {
            throw new IllegalArgumentException("Já existe uma categoria com este nome.");
        }
        Category category = Category.builder()
                .name(name)
                .ativo(true)
                .build();
        return categoryRepository.save(category);
    }

    public List<Category> listarAtivas() {
        return categoryRepository.findByAtivoTrue();
    }

    public List<Category> listarTodas() {
        return categoryRepository.findAll();
    }

    public Category buscarPorId(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada."));
    }

    public Category atualizar(Long id, String novoNome) {
        Category category = buscarPorId(id);
        if (!category.getName().equalsIgnoreCase(novoNome) && categoryRepository.existsByName(novoNome)) {
            throw new IllegalArgumentException("Já existe uma categoria com este nome.");
        }
        category.setName(novoNome);
        return categoryRepository.save(category);
    }

    public void desativar(Long id) {
        Category category = buscarPorId(id);
        category.setAtivo(false);
        categoryRepository.save(category);
    }
}
