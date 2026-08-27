import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnSubmit } from './btn-submit';

describe('BtnSubmit', () => {
  let component: BtnSubmit;
  let fixture: ComponentFixture<BtnSubmit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnSubmit],
    }).compileComponents();

    fixture = TestBed.createComponent(BtnSubmit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
