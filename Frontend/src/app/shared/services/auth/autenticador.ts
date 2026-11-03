import { Injectable, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Employee } from '../../../features/funcionario/models/employee.model';
import { User } from '../../models/user.model';
import { Client } from '../../../features/cliente/models/client.model';
import { map, Observable, of, switchMap } from 'rxjs';
import { HttpClient, HttpHandler, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router,ActivatedRoute } from '@angular/router';
const LS_CHAVE: string = 'usuarioLogado';

@Injectable({
  providedIn: 'root',
})
export class Autenticador {
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  message!: string;
  BASE_URL = 'http://localhost:8080/api/';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  private httpClient = inject(HttpClient);
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  login(login: User): Observable<Client | Employee | null> {

    return this.httpClient.post<User>(this.BASE_URL + 'usuarios/login',  {email: login.email, senha: login.password }, this.httpOptions).pipe(
      switchMap((user) => {
        if (user) {
          if (user.role === 'FUNCIONARIO') {
            return this.httpClient.get<Employee>(this.BASE_URL + 'employee/usuario/' + user.id, this.httpOptions)
        } else if (user.role === 'CLIENTE') {
            return this.httpClient.get<Client>(this.BASE_URL + 'clients/usuario/' + user.id, this.httpOptions)
        }
      }
        return of(null);
      })
    );
  }

inseriruser(user: User): Observable<User | boolean> {
  return this.httpClient.post<User>(
    this.BASE_URL + 'usuarios/',
    user,
    this.httpOptions
  )
}

  inserirCliente(usuario: Client): Observable<boolean> {
    return this.inseriruser(usuario.user).pipe(
      switchMap((userFoiInserido) => {
        if (userFoiInserido) {
          return this.httpClient
            .post<Client>(this.BASE_URL + 'clientes/', JSON.stringify(usuario), this.httpOptions)
            .pipe(map(() => true));
        } else {
          return of(false);
        }
      }),
    );
  }


inserirFuncionario(usuario: Employee): Observable<boolean> {
    return this.httpClient.post<Employee>(this.BASE_URL + 'employee', usuario, this.httpOptions).pipe(map(() => true));
}
  alterarUser(usuario: User): Observable<User> {
    return this.httpClient.put<User>(
      this.BASE_URL + 'usuarios/' + usuario.id,
      usuario,
      this.httpOptions,
    );
  }
  alterarFuncionario(funcionario: Employee): Observable<Employee> {
    funcionario.user.ativo = true;
    console.log("oiii");
    return this.httpClient.put<Employee>(
      this.BASE_URL + 'employee/' + funcionario.id,
      funcionario,
      this.httpOptions,
    );
  }
  public get usuarioLogado(): Employee | Client | null {
    if (isPlatformBrowser(this.platformId)) {
      let usu = localStorage.getItem(LS_CHAVE);
      return usu ? JSON.parse(usu) : null;
    }
    return null;
  }

  public set usuarioLogado(usuario: Employee | Client | null) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(LS_CHAVE, JSON.stringify(usuario));
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(LS_CHAVE);
      this.usuarioLogado =null
    }
  }

  autentica(){
    if (this.usuarioLogado) {
    console.log(this.usuarioLogado.user.role)
    console.log("estou logado")
    if (this.usuarioLogado.user.role === "CLIENTE"){
      console.log("sou cliente")
      this.router.navigate( ["/home"] );
    }else if (this.usuarioLogado.user.role === "FUNCIONARIO"){
      console.log("sou funcionario")
      this.router.navigate( ["/employee/home"] );
    }

  }
  else {
    this.route.queryParams.subscribe(params => {
    this.message = params['error'];
  });

}
  }



  // storageUser(user: User): boolean {
  //   if (!isPlatformBrowser(this.platformId)) return false;

  //   this.gerarId().subscribe((id) => {
  //     user.id = id;
  //   });
  //   const atual = localStorage.getItem('user');
  //   const users: User[] = atual ? JSON.parse(atual) : [];
  //   const emailuse = users.some((u) => u.email === user.email);
  //   if (emailuse) {
  //     return false;
  //   }
  //   users.push(user);
  //   localStorage.setItem('user', JSON.stringify(users));
  //   return true;
  // }

  // registerClient(client: Client): boolean {
  //   if (!isPlatformBrowser(this.platformId)) return false;

  //   if (this.storageUser(client.user)) {
  //     const nowClients = localStorage.getItem('clients');
  //     const clients: Client[] = nowClients ? JSON.parse(nowClients) : [];
  //     clients.push(client);
  //     localStorage.setItem('clients', JSON.stringify(clients));
  //     return true;
  //   }
  //   return false;
  // }

  // registerEmployee(employee: Employee): boolean {
  //   if (!isPlatformBrowser(this.platformId)) return false;

  //   if (this.storageUser(employee.user)) {
  //     const nowEmployee = localStorage.getItem('employees');
  //     const employees: Employee[] = nowEmployee ? JSON.parse(nowEmployee) : [];
  //     employees.push(employee);
  //     localStorage.setItem('employees', JSON.stringify(employees));
  //     return true;
  //   }
  //   return false;
  // }

  // loginuser(user: User): Observable<Client | Employee | null> {
  //   if (!isPlatformBrowser(this.platformId)) return of(null);

  //   const atual = localStorage.getItem('user');
  //   const users: User[] = atual ? JSON.parse(atual) : [];
  //   const usuario = users.find((us) => us.email === user.email && us.password === user.password);

  //   if (usuario?.active == true) {
  //     if (usuario?.role === 'EMPLOYEE') {
  //       const nowEmployee = localStorage.getItem('employees');
  //       const employees: Employee[] = nowEmployee ? JSON.parse(nowEmployee) : [];
  //       return of(employees.find((us) => us.user.id === usuario.id) ?? null);
  //     } else {
  //       const nowClients = localStorage.getItem('clients');
  //       const clients: Client[] = nowClients ? JSON.parse(nowClients) : [];
  //       return of(clients.find((us) => us.user.id === usuario.id) ?? null);
  //     }
  //   } else {
  //     return of(null);
  //   }
  // }
}
