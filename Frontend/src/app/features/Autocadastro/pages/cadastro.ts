import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, Validators} from '@angular/forms';
import {InputTexto} from '../../../shared/component/input-texto/input-texto';
@Component({
    selector: 'input-cadastro',
    standalone: true,
    imports: [CommonModule, InputTexto],
    template: `input-texto.`
})

export class Inputs {
    nomeControl = new FormControl('', { nonNullable: true });
    emailControl = new FormControl('', [Validators.required, Validators.email]);
    senhaControl = new FormControl('');
}