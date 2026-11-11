package com.webii.service;

import com.webii.entity.Category;
import com.webii.repository.CategoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Category criar(String name) {
        String nomeTratado = name.trim();
        
        if (categoryRepository.existsByNameIgnoreCase(nomeTratado)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe uma categoria com este nome.");
        }

        Category category = new Category();
        category.setName(nomeTratado);
        category.setAtivo(true);
        
        return categoryRepository.save(category);
    }

    public List<Category> listarAtivas() {
        return categoryRepository.findByAtivoTrueOrderByNameAsc();
    }

    public Category buscarPorId(Long id) {
        return categoryRepository.findByIdAndAtivoTrue(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrada."));
    }

    public Category atualizar(Long id, String novoNome) {
        Category category = buscarPorId(id);
        String nomeTratado = novoNome.trim();

        if (categoryRepository.existsByNameIgnoreCaseAndIdNot(nomeTratado, id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe outra categoria com este nome.");
        }

        category.setName(nomeTratado);
        return categoryRepository.save(category);
    }

    public void desativar(Long id) {
        Category category = buscarPorId(id);
        category.setAtivo(false);
        categoryRepository.save(category);
    }
}