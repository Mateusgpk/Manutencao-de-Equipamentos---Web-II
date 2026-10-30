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
    private final UserService userService ;
    public  UserController (UserService userService){
        this.userService=userService;
    }
    @GetMapping
    public ResponseEntity<List<User>> listarTodos(){
        List<User> listaUsuarios = userService.listarTodos();
        return ResponseEntity.ok(listaUsuarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> buscarUsuario(@PathVariable("id") Long id){
        User usuario = userService.encontrarPorId(id);
        if (usuario!=null){
            return ResponseEntity.ok(usuario);
        }else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<User> atualizarUsuario(@PathVariable("id") Long id,@Valid @RequestBody User usuario){
        userService.editarUsuario(usuario,id);
        return ResponseEntity.ok(usuario);
    }

    @PostMapping
    public ResponseEntity<Void> cadastrar(@Valid @RequestBody User usuario) {
        User salvo = userService.criarUsuario(usuario);
        return ResponseEntity.created(URI.create("/api/usuarios/" + salvo.getId())).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deletar(@PathVariable("id") Long id){
        boolean resposta = userService.deletar(id);
        return ResponseEntity.ok(resposta);
    }
}
