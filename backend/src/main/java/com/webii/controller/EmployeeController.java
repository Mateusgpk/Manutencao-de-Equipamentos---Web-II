package com.webii.controller;

import com.webii.entity.Client;
import com.webii.entity.Employee;
import com.webii.repository.EmployeeRepository;
import com.webii.service.EmployeeService;
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


    private final EmployeeService employeeService;
    public  EmployeeController ( EmployeeService employeeService){
        this.employeeService = employeeService;
    }
    @GetMapping
    public ResponseEntity<List<Employee>> listarTodos(){
        List<Employee> listaFuncionarios = employeeService.listarAtivos();
        return ResponseEntity.ok(listaFuncionarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> buscarFuncionario(@PathVariable("id") Long id){
        Employee funcionario = employeeService.buscarPorId(id);
        return ResponseEntity.ok(funcionario);
    }
    @GetMapping("/usuario/{id}")
    public ResponseEntity<Employee> buscarFuncionarioPorUsuario(@PathVariable("id") Long id){
        Employee funcionario = employeeService.buscarPorUserId(id);
        return ResponseEntity.ok(funcionario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> atualizarFuncionario(@PathVariable("id") Long id,@Valid @RequestBody Employee employee){
        Employee salvo = employeeService.atualizar(id,employee);
        return ResponseEntity.ok(salvo);
    }

    @PostMapping
    public ResponseEntity<Void> cadastrar(@Valid @RequestBody Employee employee) {
        Employee salvo = employeeService.criar(employee);
        return ResponseEntity.created(URI.create("/api/employee/" + salvo.getId())).build();
    }

    @DeleteMapping("/{id}")
    public void deletar(@Valid @PathVariable("id") Long id,Long idLogado){
        employeeService.desativar(id, idLogado);
    }

}
