import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ESTADO_SOLICITACAO_LABEL, EstadoSolicitacao, Solicitacao } from '../../../shared/models/solicitacao.model';
import { SolicitacaoService } from '../../../shared/services/solicitacao.service';

@Component({
  selector: 'app-client-homepage',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './client-homepage.html',
  styleUrl: './client-homepage.css',
})
export class ClientHomepage implements OnInit {
  private readonly service = inject(SolicitacaoService);
  private readonly cpfClienteLogado = '123.456.789-00';
  readonly estadoLabel = ESTADO_SOLICITACAO_LABEL;
  readonly EstadoSolicitacao = EstadoSolicitacao;
  solicitacoes: Solicitacao[] = [];

  ngOnInit(): void {
    this.service.listarTodas().subscribe((lista) => {
      this.atualizarSolicitacoes(lista.filter((s) => s.clienteCpf === this.cpfClienteLogado));
    });
  }

  private atualizarSolicitacoes(lista: Solicitacao[]): void {
    this.solicitacoes = [...lista].sort((a, b) => a.dataHoraAbertura.getTime() - b.dataHoraAbertura.getTime());
  }

  limitar(descricao: string): string {
    return descricao.length > 30 ? `${descricao.slice(0, 27)}...` : descricao;
  }

  dataHora(data: Date): string {
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(data);
  }

  visualizar(s: Solicitacao): void {
    const valor = s.valorOrcamento === undefined ? 'Não informado' : this.formatarMoeda(s.valorOrcamento);
    const historico = s.historico
      .map((h) => {
        const funcionario = h.funcionario ? ` | Funcionário: ${h.funcionario}` : '';
        const observacao = h.observacao ? ` | Obs.: ${h.observacao}` : '';
        return `${this.dataHora(h.dataHora)} - ${this.estadoLabel[h.estado]}${funcionario}${observacao}`;
      })
      .join('\n');

    alert(
      `Solicitação #${s.id}\n` +
      `Data/Hora: ${this.dataHora(s.dataHoraAbertura)}\n` +
      `Equipamento: ${s.descricaoEquipamento}\n` +
      `Categoria: ${s.categoriaEquipamento}\n` +
      `Defeito: ${s.descricaoDefeito}\n` +
      `Estado: ${this.estadoLabel[s.estado]}\n` +
      `Cliente: ${s.clienteNome} - ${s.clienteCpf}\n` +
      `Telefone: ${s.clienteTelefone}\n` +
      `Endereço: ${s.clienteEndereco}\n` +
      `Valor Orçado: ${valor}\n` +
      `Histórico:\n${historico}`,
    );
  }

  resgatar(s: Solicitacao): void {
    const confirmou = confirm(`Resgatar a solicitação #${s.id} e aprovar o serviço novamente?`);

    if (!confirmou) {
      return;
    }

    this.service.resgatarServico(s.id).subscribe((atualizada) => {
      if (!atualizada) {
        return;
      }

      this.atualizarSolicitacoes(
        this.solicitacoes.map((item) => item.id === atualizada.id ? atualizada : item),
      );
    });
  }

  pagar(s: Solicitacao): void {
    const valor = s.valorOrcamento === undefined
      ? 'valor ainda não informado'
      : this.formatarMoeda(s.valorOrcamento);

    alert(`Pagamento da Solicitação #${s.id}\nValor: ${valor}`);
  }

  private formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  }
}
