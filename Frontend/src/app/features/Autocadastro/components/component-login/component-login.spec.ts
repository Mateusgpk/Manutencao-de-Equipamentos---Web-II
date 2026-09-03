import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentLogin } from './component-login';

describe('ComponentLogin', () => {
  let component: ComponentLogin;
  let fixture: ComponentFixture<ComponentLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentLogin],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentLogin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
