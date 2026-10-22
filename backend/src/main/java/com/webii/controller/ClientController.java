package com.webii.controller;

import com.webii.entity.Client;
import com.webii.repository.ClientRepository;
import jakarta.validation.Valid;
import java.net.URI;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "http://localhost:4200")
public class ClientController {

    private final ClientRepository clientRepository;

    public ClientController(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    @GetMapping
    public  ResponseEntity<List<Client>> listarTodos(){
        List<Client> listaClientes = clientRepository.findAll();
        return ResponseEntity.ok(listaClientes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Client> buscarCliente(@PathVariable("id") Long id){
        Optional<Client> cliente = clientRepository.findByUserId(id);
        if (cliente.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }else {
            return ResponseEntity.ok(cliente.get());
        }
    }

    @PostMapping
    public ResponseEntity<Void> cadastrar(@Valid @RequestBody Client client) {
        Client salvo = clientRepository.save(client);
        return ResponseEntity.created(URI.create("/api/clientes/" + salvo.getId())).build();
    }
}