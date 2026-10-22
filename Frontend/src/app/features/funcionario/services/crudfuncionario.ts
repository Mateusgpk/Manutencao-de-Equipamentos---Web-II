import { Injectable } from '@angular/core';
import { Employee } from '../models/employee.model';
import { User } from '../../../shared/models/user.model';
import { Autenticador } from '../../../shared/services/auth/autenticador';
import { inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';
import { catchError, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class Crudfuncionario {
  BASE_URL = 'http://localhost:3000/';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  private httpClient = inject(HttpClient);
  private loginserver = inject(Autenticador)
  getallFuncionario(): Observable <Employee[]>{
    return this.httpClient.get<Employee[]>(this.BASE_URL+"funcionarios/",this.httpOptions).pipe(map((lista) => lista.filter((u)=>u.user.active===true)))
  }
  addFuncionario(employee:Employee):boolean | void {
    this.loginserver.inserirFuncionario(employee).subscribe( (id) => {
      return id;
  })
}
  alterarFuncionario(employee:Employee):boolean | void {
    this.loginserver.alterarFuncionario(employee).subscribe( (id) => {
          
    this.loginserver.alterarUser(employee.user).subscribe( (id) => {
      return id;
  })
      return id;
  })


}
  buscarPorId(id:string|undefined):Observable<Employee>{
    return this.httpClient.get<Employee>(this.BASE_URL + 'funcionarios/'+id, this.httpOptions)
  }
  desactiveFuncionario(id:string|undefined):Observable<User>{
    console.log("deu boa 1")
    console.log(id)
    return this.httpClient.get<Employee>(this.BASE_URL + 'funcionarios/'+id, this.httpOptions).pipe(switchMap((funcionario) => {
      console.log("deu boa 2")
      funcionario.user.active=false
      const funcionariouserid=funcionario.user.id
      return this.httpClient.put<Employee>(this.BASE_URL + 'funcionarios/'+id,funcionario,this.httpOptions)
      .pipe(
       
        switchMap(() =>this.httpClient.get<User>(this.BASE_URL+'usuarios/'+funcionariouserid,this.httpOptions)),
        switchMap((user)=>{
           console.log("deu boa 3")
          user.active=false;
          return this.httpClient.put<User>(this.BASE_URL+'usuarios/'+funcionariouserid,user,this.httpOptions)
        }
      )
    )
  }
))
      

  }
}

