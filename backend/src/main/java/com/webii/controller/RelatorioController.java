package com.webii.controller;

import com.webii.dto.ReceitaCategoriaDTO;
import com.webii.dto.ReceitaDiaDTO;
import com.webii.service.RelatorioService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/relatorios")
@CrossOrigin(origins = "http://localhost:4200")
public class RelatorioController {

    private final RelatorioService relatorioService;

    public RelatorioController(RelatorioService relatorioService) {
        this.relatorioService = relatorioService;
    }

    @GetMapping("/receitas")
    public List<ReceitaDiaDTO> receitas(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim) {
        return relatorioService.receitaPorDia(inicio, fim);
    }

    @GetMapping(value = "/receitas/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> receitasPdf(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim) {
        return pdf(relatorioService.pdfReceitaPorDia(inicio, fim), "relatorio-receitas.pdf");
    }

    @GetMapping("/categorias")
    public List<ReceitaCategoriaDTO> categorias() {
        return relatorioService.receitaPorCategoria();
    }

    @GetMapping(value = "/categorias/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> categoriasPdf() {
        return pdf(relatorioService.pdfReceitaPorCategoria(), "relatorio-categorias.pdf");
    }

    private ResponseEntity<byte[]> pdf(byte[] conteudo, String nome) {
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + nome)
            .contentType(MediaType.APPLICATION_PDF)
            .body(conteudo);
    }
}