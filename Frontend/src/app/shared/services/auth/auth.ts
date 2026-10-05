import { Employee } from "../../../features/funcionario/models/employee.model";
import { User } from "../../models/user.model";
import { Client } from "../../../features/cliente/models/client.model";
import { Observable } from "rxjs";
import { of } from "rxjs";



const LS_CHAVE: string = "usuarioLogado";
export const auth = {   

    get usuarioLogado(): Employee|Client|null {
    let usu = localStorage[LS_CHAVE];
    return (usu ? JSON.parse(localStorage[LS_CHAVE]) : null);
    },
    set usuarioLogado(usuario: Employee|Client) {
    localStorage[LS_CHAVE] = JSON.stringify(usuario);
    },
    logout() {
    delete localStorage[LS_CHAVE];
    },

    gerarId(): number{
        const atual=localStorage.getItem("user")
        const usuarios:User[]=atual?JSON.parse(atual) : [];
        if (usuarios.length===0){
            return 1;
        }
        return Math.max(...usuarios.map(usuarios =>usuarios.id))+1   
    },

    storageUser(user:User):boolean{
        user.id=this.gerarId();
        const atual=localStorage.getItem("user")
        const users: User[]= atual? JSON.parse(atual) :[]
        const emailuse= users.some(u=>u.email===user.email)
        if (emailuse){
            return false;
        }
        users.push(user)
        localStorage.setItem("user", JSON.stringify(users) )
        return true
    },



    registerClient(client: Client): boolean{
        if (this.storageUser(client.user)){
            const nowClients=localStorage.getItem("clients")
            const clients: Client[]=nowClients?JSON.parse(nowClients):[];
            clients.push(client);
            localStorage.setItem("clients",JSON.stringify(clients))
            return true
        }
        return false
    },

    registerEmployee(employee:Employee):boolean{
        if(this.storageUser(employee.user)){
            const nowEmployee=localStorage.getItem("employees")
            const employees: Employee[]=nowEmployee?JSON.parse(nowEmployee):[];
            employees.push(employee);
            localStorage.setItem("employees",JSON.stringify(employees)) 
            return true
        }

        return false;
    },

    loginuser (user:User): Observable<Client | Employee | null>{
        const atual=localStorage.getItem("user")
        const users:User[] = atual ? JSON.parse(atual) : [];
        const usuario = users.find(us => us.email === user.email && us.password === user.password);
        let login;
        if (usuario?.active==true){
        if (usuario?.role==="EMPLOYEE"){
            const nowEmployee=localStorage.getItem("employees")
            const employees: Employee[]=nowEmployee?JSON.parse(nowEmployee):[];
            return of(employees.find(us=> us.user.id===usuario.id)?? null)
        }else{
            const nowClients=localStorage.getItem("clients")
            const clients: Client[]=nowClients?JSON.parse(nowClients):[];
            return of(clients.find(us=> us.user.id===usuario.id)?? null)
            } 
        }
        else{
            return of(null)
        }
    }
}