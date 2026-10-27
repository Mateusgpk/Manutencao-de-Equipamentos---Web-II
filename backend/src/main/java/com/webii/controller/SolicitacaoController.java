package com.webii.controller;

import com.webii.entity.Solicitacao;
import com.webii.service.SolicitacaoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;

import com.webii.dto.ManutencaoDTO;
import com.webii.dto.OrcamentoDTO;
import com.webii.dto.RedirecionamentoDTO;
import com.webii.dto.RejeicaoDTO;
import com.webii.dto.SolicitacaoCreateDTO;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.net.URI;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/solicitacoes")
@CrossOrigin(origins = "http://localhost:4200")
public class SolicitacaoController {

    private final SolicitacaoService solicitacaoService;

    public SolicitacaoController(SolicitacaoService solicitacaoService) {
        this.solicitacaoService = solicitacaoService;
    }

    @GetMapping
    public List<Solicitacao> getAll() {
        return solicitacaoService.listarTodas();
    }

    @GetMapping("/{id}")
    public Solicitacao getById(@PathVariable Long id) {
        try {
            return solicitacaoService.buscarPorId(id);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }

    @GetMapping("/client/{clientId}")
    public List<Solicitacao> getByClient(@PathVariable Long clientId) {
        return solicitacaoService.listarPorCliente(clientId);
    }

    @GetMapping("/abertas")
    public List<Solicitacao> getAbertas() {
        return solicitacaoService.listarAbertas();
    }

    @PostMapping
    public ResponseEntity<Solicitacao> criar(@RequestParam Long clienteId, @Valid @RequestBody SolicitacaoCreateDTO dto) {
        Solicitacao criada = solicitacaoService.abrirSolicitacao(clienteId, dto);
        return ResponseEntity
            .created(URI.create("/api/solicitacoes/" + criada.getId()))
            .body(criada);
    }

    @PatchMapping("/{id}/orcamento")
    public Solicitacao efetuarOrcamento(
        @PathVariable Long id,
        @Valid @RequestBody OrcamentoDTO dto) {
            return solicitacaoService.efetuarOrcamento(id, dto);
    }

    @PatchMapping("/{id}/aprovacao")
    public Solicitacao rejeitarServico(
        @PathVariable Long id) {
        return solicitacaoService.aprovarServico(id);
        }
    
    @PatchMapping("/{id}/rejeicao")
    public Solicitacao rejeitarServico(
        @PathVariable Long id,
        @Valid @RequestBody RejeicaoDTO dto) {
            return solicitacaoService.rejeitarServico(id, dto.getMotivo());
        }

        @PatchMapping("/{id}/manutencao")
        public Solicitacao efetuarManutencao(
            @PathVariable Long id,
            @Valid @RequestBody ManutencaoDTO dto) {
                return solicitacaoService.efetuarManutencao(id, dto);
            }

            @PatchMapping("/{id}/redirecionamento")
            public Solicitacao redirecionarManutencao(
                @PathVariable Long id,
                @Valid @RequestBody RedirecionamentoDTO dto) {
                    return solicitacaoService.redirecionarManutencao(id, dto);
                }
            @PatchMapping("/{id}/pagamento")
            public Solicitacao pagarServico(@PathVariable Long id) {
                return solicitacaoService.pagarServico(id);
            }

            @PatchMapping("/{id}/finalizacao")
            public Solicitacao finalizarSolicitacao(
                @PathVariable Long id,
                @RequestParam Long funcionarioId) {
                    return solicitacaoService.finalizarSolicitacao(id, funcionarioId);
                }
}