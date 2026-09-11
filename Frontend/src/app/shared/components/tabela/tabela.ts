import { Component, Input } from '@angular/core';
import { TableColumn } from '../../models/tabela.model';

@Component({
  selector: 'app-tabela',
  standalone: true,
  templateUrl: './tabela.html'
})
export class Tabela {
  @Input({ required: true }) data: any[] = []; 
  
  @Input({ required: true }) columns: TableColumn[] = [];
}