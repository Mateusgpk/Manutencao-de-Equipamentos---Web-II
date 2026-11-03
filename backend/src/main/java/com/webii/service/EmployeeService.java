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
    public Employee criar(Employee funcionario) {
        User user = userService.criarUsuario(funcionario.getUser().getEmail(), Role.FUNCIONARIO);
        Employee employee = Employee.builder()
                .name(funcionario.getName())
                .dataNascimento(funcionario.getDataNascimento())
                .user(user)
                .build();

        return employeeRepository.save(employee);
    }

    public List<Employee> listarAtivos() {
        return employeeRepository.findAll().stream().filter(e -> e.getUser().getAtivo()).toList();
    }

    public Employee buscarPorId(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Funcionário não encontrado."));
    }
    public Employee buscarPorUserId(Long id) {
        return employeeRepository.findByUserId(id)
                .orElseThrow(() -> new IllegalArgumentException("Funcionário não encontrado."));
    }

    @Transactional
    public Employee atualizar(Long id,Employee funcionario) {
        Employee employee = buscarPorId(id);
        employee.setName(funcionario.getName());
        employee.setDataNascimento(funcionario.getDataNascimento());
        employee.getUser().setPassword(funcionario.getUser().getPassword());
        employee.getUser().setEmail(funcionario.getUser().getEmail());
        return employeeRepository.save(employee);
    }

    @Transactional
    public void desativar(Long idParaRemover, Long idFuncionarioLogado) {
        if (idParaRemover.equals(idFuncionarioLogado)) {
            throw new IllegalArgumentException("Você não pode remover a si mesmo.");
        }

        List<Employee> ativos = employeeRepository.findAll().stream().filter(e -> e.getUser().getAtivo()).toList();
        if (ativos.size() <= 1) {
            throw new IllegalArgumentException("Não é possível remover o único funcionário ativo no sistema.");
        }

        Employee employee = buscarPorId(idParaRemover);
        employee.getUser().setAtivo(false);
        employeeRepository.save(employee);
    }
}
