import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutEmployee } from './layout-employee';

describe('LayoutEmployee', () => {
  let component: LayoutEmployee;
  let fixture: ComponentFixture<LayoutEmployee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutEmployee],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutEmployee);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
