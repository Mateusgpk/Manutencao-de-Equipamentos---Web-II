package com.webii.service;

import com.webii.entity.Employee;
import com.webii.entity.User;
import com.webii.enums.Role;
import com.webii.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserService userService;

    public EmployeeService(EmployeeRepository employeeRepository, UserService userService) {
        this.employeeRepository = employeeRepository;
        this.userService = userService;
    }

    @Transactional
    public Employee criar(String name, String email, LocalDate dataNascimento, String senha) {
        User user = userService.criarUsuario(email, senha, Role.FUNCIONARIO);

        Employee employee = Employee.builder()
                .name(name)
                .dataNascimento(dataNascimento)
                .ativo(true)
                .user(user)
                .build();

        return employeeRepository.save(employee);
    }

    public List<Employee> listarAtivos() {
        return employeeRepository.findByAtivoTrue();
    }

    public Employee buscarPorId(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Funcionário não encontrado."));
    }

    @Transactional
    public Employee atualizar(Long id, String name, LocalDate dataNascimento) {
        Employee employee = buscarPorId(id);
        employee.setName(name);
        employee.setDataNascimento(dataNascimento);
        return employeeRepository.save(employee);
    }

    @Transactional
    public void desativar(Long idParaRemover, Long idFuncionarioLogado) {
        if (idParaRemover.equals(idFuncionarioLogado)) {
            throw new IllegalArgumentException("Você não pode remover a si mesmo.");
        }

        List<Employee> ativos = employeeRepository.findByAtivoTrue();
        if (ativos.size() <= 1) {
            throw new IllegalArgumentException("Não é possível remover o único funcionário ativo no sistema.");
        }

        Employee employee = buscarPorId(idParaRemover);
        employee.setAtivo(false);
        employeeRepository.save(employee);
    }
}
