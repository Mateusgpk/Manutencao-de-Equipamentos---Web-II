import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTexto } from './input-texto';

describe('InputTexto', () => {
  let component: InputTexto;
  let fixture: ComponentFixture<InputTexto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputTexto],
    }).compileComponents();

    fixture = TestBed.createComponent(InputTexto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
