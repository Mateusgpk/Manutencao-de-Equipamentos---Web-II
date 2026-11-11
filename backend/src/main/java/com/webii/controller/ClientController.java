package com.webii.controller;

import com.webii.dto.AutoCadastroDTO;
import com.webii.entity.Client;

import com.webii.repository.ClientRepository;

import com.webii.service.ClientService;
import jakarta.validation.Valid;

import java.net.URI;

import java.net.http.HttpResponse;

import java.util.ArrayList;

import java.util.List;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "http://localhost:4200")
public class ClientController {

    @Autowired

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }


    @GetMapping
    public  ResponseEntity<List<Client>> listarTodos(){
        List<Client> listaClientes = clientService.listarTodos();
        return ResponseEntity.ok(listaClientes);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Client> buscarCliente(@PathVariable("id") Long id){
        Client cliente = clientService.buscarPorId(id);
            return ResponseEntity.ok(cliente);
    }

    @GetMapping("usuario/{id}")
    public ResponseEntity<Client> buscarUserCliente(@PathVariable("id") Long id){
        Client cliente = clientService.buscarPorUserId(id);
        return ResponseEntity.ok(cliente);
    }

    
    @PostMapping
    public ResponseEntity<Void> cadastrar(@Valid @RequestBody AutoCadastroDTO client) {
        Client salvo = clientService.autocadastro(client);
        return ResponseEntity.created(URI.create("/api/clients/" + salvo.getId())).build();
    }
}