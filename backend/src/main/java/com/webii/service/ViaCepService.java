package com.webii.service;

import com.webii.dto.ViaCepResponseDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ViaCepService {

    private final RestTemplate restTemplate = new RestTemplate();

    public ViaCepResponseDTO buscarEnderecoPorCep(String cep) {
        String cleanCep = cep.replaceAll("\\D", "");
        if (cleanCep.length() != 8) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "CEP inválido. Deve possuir 8 dígitos.");
        }
        String url = "https://viacep.com.br/ws/" + cleanCep + "/json/";
        ViaCepResponseDTO response;
        try {
            response = restTemplate.getForObject(url, ViaCepResponseDTO.class);
        } catch (RestClientException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Não foi possível consultar o ViaCEP.", ex);
        }
        if (response == null || Boolean.TRUE.equals(response.getErro())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "CEP não encontrado.");
        }
        return response;
    }
}
