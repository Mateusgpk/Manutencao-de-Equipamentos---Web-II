import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsCadastroComponent} from '../components/forms-cadastro';
@Component({
    selector: 'cadastro',
    standalone: true,
    imports: [CommonModule, FormsCadastroComponent],
    template: `<forms-cadastro></forms-cadastro>`
})

export class CadastroComponent {

}