import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsCadastroComponent} from '../components/forms-cadastro';
@Component({
    selector: 'cadastro',
    standalone: true,
    imports: [CommonModule, FormsCadastroComponent],
    templateUrl: `./cadastro.html`,
})

export class CadastroComponent {

}