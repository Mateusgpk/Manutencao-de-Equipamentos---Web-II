package com.webii.service;

import com.webii.entity.Employee;
import com.webii.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EmployeeService
{
    @Autowired
    private EmployeeRepository employeeRepository;

    public List<Employee> findAllActive()
    {
        return employeeRepository.findByUserActiveTrue();
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

        if (employeeRepository.countByUserActiveTrue() <= 1)
        {
            throw new IllegalStateException("Não é possível remover o único funcionário ativo no sistema.");
        }

        employee.getUser().setActive(false);
        employeeRepository.save(employee);
    }
}
