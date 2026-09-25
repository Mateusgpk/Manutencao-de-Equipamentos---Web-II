import { Employee } from "../../../features/funcionario/models/employee.model";
import { User } from "../../models/user.model";
import { Client } from "../../../features/cliente/models/client.model";
import { register } from "node:module";


export const auth = {
    storageUser(user:User):boolean{
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
        client.user.role="CLIENTE"
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
        employee.user.role = "FUNCIONARIO"; 
        if(this.storageUser(employee.user)){
            const nowEmployee=localStorage.getItem("employees")
            const employees: Employee[]=nowEmployee?JSON.parse(nowEmployee):[];
            employees.push(employee);
            localStorage.setItem("employees",JSON.stringify(employees)) 
            return true
        }

        return false;
    },

    loginuser (user:User):{ sucesso: boolean; role?: string }{
        const atual=localStorage.getItem("user")
        const users:User[] = atual ? JSON.parse(atual) : [];
        const usuario = users.find(us => us.email === user.email && us.password === user.password)
        if (usuario){
            return{
                sucesso:true,
                role:usuario.role
            };
        }

        return{
            sucesso:false
        };
    }
}