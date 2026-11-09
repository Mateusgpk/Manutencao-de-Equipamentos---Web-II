package com.webii.service;

import com.webii.entity.Employee;
import com.webii.entity.User;
import com.webii.enums.Role;
import com.webii.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EmployeeService
{
    @Autowired
    private final EmployeeRepository employeeRepository;
    private final UserService userService;

    public EmployeeService(EmployeeRepository employeeRepository, UserService userService) {
        this.employeeRepository = employeeRepository;
        this.userService = userService;
    }


    @Transactional
    public Employee criar(Employee funcionario) {

        User user = user.service.criarUsuarioParaFuncionario(
            funcionario.getUser().getEmail(),
            funcionario.getUser().getPassword(),
            Role.FUNCIONARIO
        );

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

    @Transactional
    public Employee atualizar(Long id,Employee funcionario) {
        System.out.println("ola"+funcionario);
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado."));
        employee.setName(funcionario.getName());
        employee.setDataNascimento(funcionario.getDataNascimento());
        if (funcionario.getUser().getPassword().isBlank()) {
            employee.getUser().setPassword(
                userService.hashSenhaComSalt(
                    funcionario.getUser().getPassword()
                )
            );
        }
        employee.getUser().setEmail(funcionario.getUser().getEmail());
        return employeeRepository.save(employee);
    }

    public Employee buscarPorId(Long id) {
        return employeeRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Funcionário não encontrado."));
    }
    public Employee buscarPorUserId(Long id) {
        return employeeRepository.findByUserId(id)
                .orElseThrow(() -> new IllegalArgumentException("Funcionário não encontrado."));
    }

    @Transactional
    public void deleteEmployee(Long employeeId, Long loggedUserId)
    {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado."));

        if (employee.getUser().getId().equals(loggedUserId))
        {
            throw new IllegalStateException("Você não pode remover o seu próprio perfil.");
        }

        if (employeeRepository.countByUser_AtivoTrue() <= 1)
        {
            throw new IllegalStateException("Não é possível remover o único funcionário ativo no sistema.");
        }

        employee.getUser().setAtivo(false);
        employeeRepository.save(employee);
    }
}
