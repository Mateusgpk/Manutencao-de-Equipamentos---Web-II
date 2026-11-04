package com.webii.service;

import com.webii.entity.Employee;
import com.webii.entity.HistoricoSolicitacao;
import com.webii.entity.Solicitacao;
import com.webii.enums.EstadoSolicitacao;
import com.webii.repository.HistoricoSolicitacaoRepository;
import com.webii.repository.SolicitacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class SolicitacaoService
{
    @Autowired
    private SolicitacaoRepository solicitacaoRepository;

    @Autowired
    private HistoricoSolicitacaoRepository historicoRepository;

    @Transactional
    public void registrarHistorico(Solicitacao solicitacao, EstadoSolicitacao estadoAnterior, 
                                   EstadoSolicitacao estadoNovo, String justificativa, Employee funcionario)
    {
        HistoricoSolicitacao historico = new HistoricoSolicitacao();
        historico.setSolicitacao(solicitacao);
        historico.setEstadoAnterior(estadoAnterior);
        historico.setEstadoNovo(estadoNovo);
        historico.setJustificativa(justificativa);
        historico.setFuncionario(funcionario);
        historico.setDataHora(LocalDateTime.now());

        historicoRepository.save(historico);
    }

    @Transactional
    public void redirecionarSolicitacao(Long solicitacaoId, Employee origem, Employee destino)
    {
        if (origem.getId().equals(destino.getId()))
        {
            throw new IllegalArgumentException("Uma solicitação não pode ser redirecionada para o mesmo funcionário.");
        }

        Solicitacao solicitacao = solicitacaoRepository.findById(solicitacaoId)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada."));

        EstadoSolicitacao estadoAnterior = solicitacao.getEstado();
        solicitacao.setEstado(EstadoSolicitacao.REDIRECIONADA);
        solicitacao.setFuncionarioDestino(destino);
        solicitacaoRepository.save(solicitacao);

        String desc = "Redirecionada do funcionário " + origem.getUser().getName() + " para " + destino.getUser().getName();
        registrarHistorico(solicitacao, estadoAnterior, EstadoSolicitacao.REDIRECIONADA, desc, origem);
    }
}
