package com.webii.controller;


import com.webii.entity.User;

import com.webii.repository.UserRepository;
import com.webii.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;
@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {
    private final UserService userService;
    public  UserController (UserRepository userRepository){
        this.userRepository=userRepository;
    }
    @GetMapping
    public ResponseEntity<List<User>> listarTodos(){
        List<User> listaUsuarios = userRepository.findAll();
        return ResponseEntity.ok(listaUsuarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> buscarFuncionario(@PathVariable("id") Long id){
        Optional<User> usuario = userRepository.findById(id);
        if (usuario.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }else {
            return ResponseEntity.ok(usuario.get());
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<User> atualizarFuncionario(@PathVariable("id") Long id,@Valid @RequestBody User usuario){
        usuario.setId(id);
        User salvo = userRepository.save(usuario);
        return ResponseEntity.ok(usuario);
    }

    @PostMapping
    public ResponseEntity<Void> cadastrar(@Valid @RequestBody User usuario) {
        User salvo = userService.save(usuario);
        return ResponseEntity.created(URI.create("/api/users/" + salvo.getId())).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deletar(@PathVariable("id") Long id){
        boolean resposta = userService.deletar(id);
        return ResponseEntity.ok(resposta);
    }
}
