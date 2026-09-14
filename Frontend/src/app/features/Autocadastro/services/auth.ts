
export class User {
    name: string;
    email: string;
    cpf: string;
    cep: string;
    endereco: string;
    estado: string;
    cidade: string;
    bairro: string;
    numero: string;
    complemento: string;
    senha: string;
    constructor (name:string,email:string,cpf:string,cep:string,endereco:string,estado:string,cidade:string,bairro:string,numero:string,complemento:string,senha:string){
        this.name=name
        this.email=email
        this.cpf=cpf
        this.cep=cep
        this.endereco=endereco
        this.estado=estado
        this.cidade=cidade
        this.bairro=bairro
        this.numero=numero
        this.complemento=complemento
        this.senha=senha
    }

}

export class Login{
    email: string;
    senha: string;
    constructor (email:string,senha:string){
        this.email=email
        this.senha=senha
    }
}


export const auth = {
    registerUser(user: User): boolean{


        const atual=localStorage.getItem("user")
        const users: User[]= atual? JSON.parse(atual) :[]
        const emailemuso= users.some(u=>u.email===user.email)
        if (emailemuso){
            return false;
        }
        users.push(user)
        localStorage.setItem( "user" ,JSON.stringify(users) )
        return true
    },

    loginuser (login:Login):boolean{
        const atual=localStorage.getItem("user")
        const users:User[] = atual ? JSON.parse(atual) : [];
        return users.some(us => us.email === login.email && us.senha === login.senha)
    }
}