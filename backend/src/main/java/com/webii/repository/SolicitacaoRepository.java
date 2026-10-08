package com.webii.repository;

import com.webii.entity.Solicitacao;
import com.webii.enums.EstadoSolicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {
    List<Solicitacao> findByClienteId(Long clienteId);
    List<Solicitacao> findByEstado(EstadoSolicitacao estado);
    List<Solicitacao> findByFuncionarioOrcamentoId(Long funcionarioId);
    List<Solicitacao> findByFuncionarioManutencaoId(Long funcionarioId);
    List<Solicitacao> findByFuncionarioDestinoId(Long funcionarioId);
}
