package com.webii.repository;

import com.webii.entity.Solicitacao;
import com.webii.enums.EstadoSolicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {
    List<Solicitacao> findByClienteId(Long clienteId);
    List<Solicitacao> findByEstado(EstadoSolicitacao estado);
    List<Solicitacao> findByFuncionarioOrcamentoId(Long funcionarioId);
    List<Solicitacao> findByFuncionarioManutencaoId(Long funcionarioId);
    List<Solicitacao> findByFuncionarioDestinoId(Long funcionarioId);

    @Query("""
        select s from Solicitacao s
        join fetch s.categoriaEquipamento
        where s.dataHoraPagamento is not null
            and s.valorOrcamento is not null
            and (:inicio is null or s.dataHoraPagamento >= :inicio)
            and (:fim is null or s.dataHoraPagamento < :fim)
        order by s.dataHoraPagamento asc
        """)
    List<Solicitacao> findReceitas(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);
}