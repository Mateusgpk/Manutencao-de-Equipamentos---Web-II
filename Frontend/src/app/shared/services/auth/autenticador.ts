import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Employee } from "../../../features/funcionario/models/employee.model";
import { User } from "../../models/user.model";
import { Client } from "../../../features/cliente/models/client.model";
import { Observable, of } from "rxjs";

const LS_CHAVE: string = "usuarioLogado";

@Injectable({
  providedIn: 'root',
})
export class Autenticador {
  // Injetamos o PLATFORM_ID para saber se estamos no navegador ou no servidor Node
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  public get usuarioLogado(): Employee | Client | null {
    if (isPlatformBrowser(this.platformId)) {
      let usu = localStorage.getItem(LS_CHAVE);
      return usu ? JSON.parse(usu) : null;
    }
    return null; // Retorna null se estiver no servidor
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

  gerarId(): number {
    if (!isPlatformBrowser(this.platformId)) return 1;

    const atual = localStorage.getItem("user");
    const usuarios: User[] = atual ? JSON.parse(atual) : [];
    if (usuarios.length === 0) {
      return 1;
    }
    return Math.max(...usuarios.map(usuarios => usuarios.id)) + 1;
  }

  storageUser(user: User): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;

    user.id = this.gerarId();
    const atual = localStorage.getItem("user");
    const users: User[] = atual ? JSON.parse(atual) : [];
    const emailuse = users.some(u => u.email === user.email);
    if (emailuse) {
      return false;
    }
    users.push(user);
    localStorage.setItem("user", JSON.stringify(users));
    return true;
  }

  registerClient(client: Client): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;

    if (this.storageUser(client.user)) {
      const nowClients = localStorage.getItem("clients");
      const clients: Client[] = nowClients ? JSON.parse(nowClients) : [];
      clients.push(client);
      localStorage.setItem("clients", JSON.stringify(clients));
      return true;
    }
    return false;
  }

  registerEmployee(employee: Employee): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;

    if (this.storageUser(employee.user)) {
      const nowEmployee = localStorage.getItem("employees");
      const employees: Employee[] = nowEmployee ? JSON.parse(nowEmployee) : [];
      employees.push(employee);
      localStorage.setItem("employees", JSON.stringify(employees));
      return true;
    }
    return false;
  }

  loginuser(user: User): Observable<Client | Employee | null> {
    if (!isPlatformBrowser(this.platformId)) return of(null);

    const atual = localStorage.getItem("user");
    const users: User[] = atual ? JSON.parse(atual) : [];
    const usuario = users.find(us => us.email === user.email && us.password === user.password);
    
    if (usuario?.active == true) {
      if (usuario?.role === "EMPLOYEE") {
        const nowEmployee = localStorage.getItem("employees");
        const employees: Employee[] = nowEmployee ? JSON.parse(nowEmployee) : [];
        return of(employees.find(us => us.user.id === usuario.id) ?? null);
      } else {
        const nowClients = localStorage.getItem("clients");
        const clients: Client[] = nowClients ? JSON.parse(nowClients) : [];
        return of(clients.find(us => us.user.id === usuario.id) ?? null);
      }
    } else {
      return of(null);
    }
  }
}