import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioReceitas } from './relatorio-receitas';

describe('RelatorioReceitas', () => {
  let component: RelatorioReceitas;
  let fixture: ComponentFixture<RelatorioReceitas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatorioReceitas],
    }).compileComponents();

    fixture = TestBed.createComponent(RelatorioReceitas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
