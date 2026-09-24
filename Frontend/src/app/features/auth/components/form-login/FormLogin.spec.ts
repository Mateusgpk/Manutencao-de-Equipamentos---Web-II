import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLogin } from './FormLogin';

describe('FormLogin', () => {
  let component: FormLogin;
  let fixture: ComponentFixture<FormLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormLogin],
    }).compileComponents();

    fixture = TestBed.createComponent(FormLogin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
