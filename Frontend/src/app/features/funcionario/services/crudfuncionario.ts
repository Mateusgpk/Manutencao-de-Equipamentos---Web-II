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
  BASE_URL = 'http://localhost:8080/api/';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  private httpClient = inject(HttpClient);
  private loginserver = inject(Autenticador)
  getallFuncionario(): Observable <Employee[]>{
    return this.httpClient.get<Employee[]>(this.BASE_URL+"employee",this.httpOptions)
  }
  addFuncionario(employee:Employee):boolean | void {
    this.loginserver.inserirFuncionario(employee).subscribe( (id) => {
      return id;
  })
}
  alterarFuncionario(employee:Employee):Observable<boolean> {
     return this.loginserver.alterarFuncionario(employee).pipe(
      map(() => true)
    );
   }

  buscarPorId(id:string|undefined):Observable<Employee>{
    return this.httpClient.get<Employee>(this.BASE_URL + 'employee/'+id, this.httpOptions)
  }
  desactiveFuncionario(id:string|undefined):Observable<User>{
    return this.httpClient.delete<User>(this.BASE_URL + 'employee/'+id+ '/' + this.loginserver.usuarioLogado?.id, this.httpOptions)
      

  }
}

