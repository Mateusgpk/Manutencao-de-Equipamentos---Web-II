import { TestBed } from '@angular/core/testing';
import { Employee } from '../models/employee.model';
import { User } from '../../../shared/models/user.model';
import { Crudfuncionario } from './crudfuncionario';

describe('Crudfuncionario', () => {
  let service: Crudfuncionario;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Crudfuncionario);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

