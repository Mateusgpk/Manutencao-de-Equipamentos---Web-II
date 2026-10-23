package com.webii.controller;

import com.webii.entity.Client;
import com.webii.entity.Employee;
import com.webii.repository.EmployeeRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/employee")
@CrossOrigin(origins = "http://localhost:4200")
public class EmployeeController {

    private final EmployeeRepository employeeRepository;
    public  EmployeeController (EmployeeRepository employeeRepository){
        this.employeeRepository=employeeRepository;
    }
    @GetMapping
    public ResponseEntity<List<Employee>> listarTodos(){
        List<Employee> listaFuncionarios = employeeRepository.findAll();
        return ResponseEntity.ok(listaFuncionarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> buscarFuncionario(@PathVariable("id") Long id){
        Optional<Employee> funcionario = employeeRepository.findByUserId(id);
        if (funcionario.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }else {
            return ResponseEntity.ok(funcionario.get());
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<Employee> atualizarFuncionario(@PathVariable Long id,@Valid @RequestBody Employee employee){
        employee.setId(id);
        Employee salvo = employeeRepository.save(employee);
        return ResponseEntity.ok(employee);
    }

    @PostMapping
    public ResponseEntity<Void> cadastrar(@Valid @RequestBody Employee employee) {
        Employee salvo = employeeRepository.save(employee);
        return ResponseEntity.created(URI.create("/api/employee/" + salvo.getId())).build();
    }

}
