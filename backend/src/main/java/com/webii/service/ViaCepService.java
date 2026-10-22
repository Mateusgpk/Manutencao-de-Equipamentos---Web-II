package com.webii.service;

import com.webii.dto.ViaCepResponseDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ViaCepService {

    private final RestTemplate restTemplate = new RestTemplate();

    public ViaCepResponseDTO buscarEnderecoPorCep(String cep) {
        String cleanCep = cep.replaceAll("\\D", "");
        if (cleanCep.length() != 8) {
            throw new IllegalArgumentException("CEP inválido. Deve possuir 8 dígitos.");
        }
        String url = "https://viacep.com.br/ws/" + cleanCep + "/json/";
        ViaCepResponseDTO response = restTemplate.getForObject(url, ViaCepResponseDTO.class);
        if (response == null || Boolean.TRUE.equals(response.getErro())) {
            throw new IllegalArgumentException("CEP não encontrado.");
        }
        return response;
    }
}
