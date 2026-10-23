import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioCategorias } from './relatorio-categorias';

describe('RelatorioCategorias', () => {
  let component: RelatorioCategorias;
  let fixture: ComponentFixture<RelatorioCategorias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatorioCategorias],
    }).compileComponents();

    fixture = TestBed.createComponent(RelatorioCategorias);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
