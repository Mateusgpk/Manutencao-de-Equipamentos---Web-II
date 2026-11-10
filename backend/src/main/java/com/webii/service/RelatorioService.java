package com.webii.service;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.webii.dto.ReceitaCategoriaDTO;
import com.webii.dto.ReceitaDiaDTO;
import com.webii.entity.Solicitacao;
import com.webii.repository.SolicitacaoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class RelatorioService {
    private static final DateTimeFormatter DATA = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private final SolicitacaoRepository solicitacaoRepository;

    public RelatorioService(SolicitacaoRepository solicitacaoRepository) {
        this.solicitacaoRepository = solicitacaoRepository;
    }

    public List<ReceitaDiaDTO> receitaPorDia(LocalDate inicio, LocalDate fim) {
        if (inicio != null && fim != null && inicio.isAfter(fim)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "A data inicial não pode ser posterior à data final.");
        }
        List<Solicitacao> receitas = solicitacaoRepository.findReceitas(
            inicio == null ? null : inicio.atStartOfDay(),
            fim == null ? null : fim.plusDays(1).atStartOfDay());

        return receitas.stream()
            .collect(Collectors.groupingBy(s -> s.getDataHoraPagamento().toLocalDate(),
                TreeMap::new, Collectors.toList()))
            .entrySet().stream()
            .map(grupo -> new ReceitaDiaDTO(grupo.getKey(), (long) grupo.getValue().size(),
                somar(grupo.getValue())))
            .toList();
    }

    public List<ReceitaCategoriaDTO> receitaPorCategoria() {
        return solicitacaoRepository.findReceitas(null, null).stream()
            .collect(Collectors.groupingBy(s -> s.getCategoriaEquipamento().getName(),
                TreeMap::new, Collectors.toList()))
            .entrySet().stream()
            .map(grupo -> new ReceitaCategoriaDTO(grupo.getKey(), (long) grupo.getValue().size(),
                somar(grupo.getValue())))
            .toList();
    }

    public byte[] pdfReceitaPorDia(LocalDate inicio, LocalDate fim) {
        List<ReceitaDiaDTO> receitas = receitaPorDia(inicio, fim);
        String periodo = "Período: " + (inicio == null ? "desde o início" : DATA.format(inicio))
            + " até " + (fim == null ? "a data atual" : DATA.format(fim));
        return gerarPdf("Relatório de receitas", periodo, "Dia", receitas.stream()
            .map(r -> new String[] {DATA.format(r.dia()), r.quantidade().toString(), moeda(r.total())})
            .toList(), receitas.stream().map(ReceitaDiaDTO::total).reduce(BigDecimal.ZERO, BigDecimal::add));
    }

    public byte[] pdfReceitaPorCategoria() {
        List<ReceitaCategoriaDTO> receitas = receitaPorCategoria();
        return gerarPdf("Relatório de receitas por categoria", "Todo o período", "Categoria",
            receitas.stream()
                .map(r -> new String[] {r.categoria(), r.quantidade().toString(), moeda(r.total())})
                .toList(),
            receitas.stream().map(ReceitaCategoriaDTO::total).reduce(BigDecimal.ZERO, BigDecimal::add));
    }

    private BigDecimal somar(List<Solicitacao> solicitacoes) {
        return solicitacoes.stream().map(Solicitacao::getValorOrcamento)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private String moeda(BigDecimal valor) {
        return NumberFormat.getCurrencyInstance(Locale.forLanguageTag("pt-BR")).format(valor);
    }

    private byte[] gerarPdf(String titulo, String periodo, String agrupamento,
                            List<String[]> linhas, BigDecimal total) {
        ByteArrayOutputStream saida = new ByteArrayOutputStream();
        Document documento = new Document();
        try {
            PdfWriter.getInstance(documento, saida);
            documento.open();
            documento.add(new Paragraph(titulo));
            documento.add(new Paragraph(periodo));
            PdfPTable tabela = new PdfPTable(3);
            tabela.setWidthPercentage(100);
            tabela.setSpacingBefore(16);
            tabela.addCell(agrupamento);
            tabela.addCell("Quantidade");
            tabela.addCell("Receita");
            tabela.setHeaderRows(1);
            for (String[] linha : linhas) {
                for (String celula : linha) tabela.addCell(celula);
            }
            documento.add(tabela);
            if (linhas.isEmpty()) documento.add(new Paragraph("Nenhuma receita encontrada."));
            documento.add(new Paragraph("Total: " + moeda(total)));
        } catch (DocumentException ex) {
            throw new IllegalStateException("Não foi possível gerar o relatório PDF.", ex);
        } finally {
            documento.close();
        }
        return saida.toByteArray();
    }
}