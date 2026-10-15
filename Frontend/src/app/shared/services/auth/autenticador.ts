import { Injectable, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Employee } from '../../../features/funcionario/models/employee.model';
import { User } from '../../models/user.model';
import { Client } from '../../../features/cliente/models/client.model';
import { map, Observable, of, switchMap } from 'rxjs';
import { HttpClient, HttpHandler, HttpHeaders, HttpResponse } from '@angular/common/http';

const LS_CHAVE: string = 'usuarioLogado';

@Injectable({
  providedIn: 'root',
})
export class Autenticador {
  BASE_URL = 'http://localhost:3000/';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  private httpClient = inject(HttpClient);
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  login(login: User): Observable<Client | Employee | null> {
    return this.httpClient.get<User[]>(this.BASE_URL + 'usuarios/', this.httpOptions).pipe(
      switchMap((lista) => {
        let usu = lista.find((u) => u.email === login.email && u.password === login.password);
        if (usu && usu.active == true) {
          if (usu.role === 'EMPLOYEE') {
            return this.httpClient.get<Employee[]>(this.BASE_URL + 'funcionarios/', this.httpOptions)
              .pipe(
                map((lista) => {
                  let igual = lista.find((u) => u.user.idUser == usu.idUser);
                  return igual || null;
                }),
              );
          } else {
            return this.httpClient.get<Client[]>(this.BASE_URL + 'clientes/', this.httpOptions).pipe(
              map((lista) => {
                let igual = lista.find((u) => u.user.idUser == usu.idUser);
                return igual || null;
              }),
            );
          }
        }
        return of(null);
      }),
    );
  }
  inseriruser(user: User): Observable<boolean> {
    this.gerarId().subscribe((id) => {
      user.idUser = id;
    });
    return this.httpClient.get<User[]>(this.BASE_URL + 'usuarios/', this.httpOptions).pipe(
      map((lista) => lista.find((u) => u.email === user.email)),
      switchMap((usuarioEncontrado) => {
        if (usuarioEncontrado) {
          return of(false);
        } else {

          return this.httpClient
            .post<User>(this.BASE_URL + 'usuarios/', JSON.stringify(user), this.httpOptions)
            .pipe(map(() => true));
        }
      }),
    );
  }
  inserir(usuario: Client): Observable<boolean> {
    this.gerarId().subscribe((id) => {
      usuario.user.idUser = id;
    });
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
  alterar(usuario: User): Observable<User> {
    return this.httpClient.put<User>(
      this.BASE_URL + 'usuarios/' + usuario.idUser,
      JSON.stringify(usuario),
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

  public set usuarioLogado(usuario: Employee | Client) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(LS_CHAVE, JSON.stringify(usuario));
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(LS_CHAVE);
    }
  }

  gerarId(): Observable<number> {
    return this.httpClient.get<User[]>(this.BASE_URL + 'usuarios/', this.httpOptions).pipe(
      map((lista) => lista.map((u) => u.idUser)),
      map((ids) => (ids.length > 0 ? Math.max(...ids) + 1 : 1)),
    );
  }

  storageUser(user: User): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;

    this.gerarId().subscribe((id) => {
      user.idUser = id;
    });
    const atual = localStorage.getItem('user');
    const users: User[] = atual ? JSON.parse(atual) : [];
    const emailuse = users.some((u) => u.email === user.email);
    if (emailuse) {
      return false;
    }
    users.push(user);
    localStorage.setItem('user', JSON.stringify(users));
    return true;
  }

  registerClient(client: Client): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;

    if (this.storageUser(client.user)) {
      const nowClients = localStorage.getItem('clients');
      const clients: Client[] = nowClients ? JSON.parse(nowClients) : [];
      clients.push(client);
      localStorage.setItem('clients', JSON.stringify(clients));
      return true;
    }
    return false;
  }

  registerEmployee(employee: Employee): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;

    if (this.storageUser(employee.user)) {
      const nowEmployee = localStorage.getItem('employees');
      const employees: Employee[] = nowEmployee ? JSON.parse(nowEmployee) : [];
      employees.push(employee);
      localStorage.setItem('employees', JSON.stringify(employees));
      return true;
    }
    return false;
  }

  loginuser(user: User): Observable<Client | Employee | null> {
    if (!isPlatformBrowser(this.platformId)) return of(null);

    const atual = localStorage.getItem('user');
    const users: User[] = atual ? JSON.parse(atual) : [];
    const usuario = users.find((us) => us.email === user.email && us.password === user.password);

    if (usuario?.active == true) {
      if (usuario?.role === 'EMPLOYEE') {
        const nowEmployee = localStorage.getItem('employees');
        const employees: Employee[] = nowEmployee ? JSON.parse(nowEmployee) : [];
        return of(employees.find((us) => us.user.idUser === usuario.idUser) ?? null);
      } else {
        const nowClients = localStorage.getItem('clients');
        const clients: Client[] = nowClients ? JSON.parse(nowClients) : [];
        return of(clients.find((us) => us.user.idUser === usuario.idUser) ?? null);
      }
    } else {
      return of(null);
    }
  }
}
