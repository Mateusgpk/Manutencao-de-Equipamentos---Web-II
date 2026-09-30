import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addfuncionario } from './addfuncionario';

describe('Addfuncionario', () => {
  let component: Addfuncionario;
  let fixture: ComponentFixture<Addfuncionario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Addfuncionario],
    }).compileComponents();

    fixture = TestBed.createComponent(Addfuncionario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
