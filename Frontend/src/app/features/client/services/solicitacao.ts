import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Solicitacao } from '../../../models/solicitacao.model';

@Injectable({ providedIn: 'root' })
export class SolicitacaoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/solicitacoes'; 

  enviarNovaSolicitacao(dados: any): Observable<Solicitacao> {
    return this.http.post<Solicitacao>(this.apiUrl, dados);
  }
}
