package.com.webii.controller;

import com.webii.entity.Client;
import com.webii.repository.ClientRepository;
import jakarta.validation.Valid;
import java.net.URI;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "http://localhost:4200")
public class ClientController {

    private final ClientRepository clientRepository;

    public ClientController(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    @PostMapping
    public ResponseEntity<Void> cadastrar(@Valid @RequestBody Client client) {
        Client salvo = clientRepository.save(client);
        return ResponseEntity.created(URI.create("/api/clientes/" + salvo.getId())).build();
    }
}