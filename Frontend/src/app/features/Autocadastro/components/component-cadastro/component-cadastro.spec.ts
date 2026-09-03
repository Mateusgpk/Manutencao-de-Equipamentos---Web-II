import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentCadastro } from './component-cadastro';

describe('ComponentCadastro', () => {
  let component: ComponentCadastro;
  let fixture: ComponentFixture<ComponentCadastro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentCadastro],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentCadastro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
