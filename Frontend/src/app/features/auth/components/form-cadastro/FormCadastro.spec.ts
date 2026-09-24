import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCadastro } from './FormCadastro';

describe('FormCadastro', () => {
  let component: FormCadastro;
  let fixture: ComponentFixture<FormCadastro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCadastro],
    }).compileComponents();

    fixture = TestBed.createComponent(FormCadastro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
