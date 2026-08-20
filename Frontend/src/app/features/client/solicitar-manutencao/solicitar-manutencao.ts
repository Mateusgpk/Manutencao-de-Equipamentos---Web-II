import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { InputTexto } from '../../../shared/component/input-texto/input-texto';

@Component({
  selector: 'app-solicitar-manutencao',
  standalone: true,
  imports: [ReactiveFormsModule, InputTexto], 
  templateUrl: './solicitar-manutencao.html',
  styleUrl: './solicitar-manutencao.css',
})
export class SolicitarManutencao {

  formSolicitacao = new FormGroup({
    descricaoEquipamento: new FormControl(''),
    categoriaEquipamento: new FormControl('')
  });

}