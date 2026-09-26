import { TestBed } from '@angular/core/testing';
import { Employee } from '../models/employee.model';
import { User } from '../../../shared/models/user.model';
import { Crudfuncionario } from './crudfuncionario';

describe('Crudfuncionario', () => {
  let service: Crudfuncionario;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Crudfuncionario);
    
const funcionario = new Employee();

funcionario.id = 1;
funcionario.name = 'João';
funcionario.birthDate = '2000-05-15';
funcionario.user = new User('joao@email.com', '123456');

service.addFuncionario(funcionario);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

