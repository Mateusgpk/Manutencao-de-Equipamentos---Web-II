import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudFuncionario } from './crud-funcionario';

describe('CrudFuncionario', () => {
  let component: CrudFuncionario;
  let fixture: ComponentFixture<CrudFuncionario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudFuncionario],
    }).compileComponents();

    fixture = TestBed.createComponent(CrudFuncionario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
