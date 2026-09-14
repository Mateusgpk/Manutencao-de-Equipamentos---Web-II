
export class User {
    name!: string;
    email!: string;
    cpf!: string;
    cep!: string;
    endereco!: string;
    estado!: string;
    cidade!: string;
    bairro!: string;
    numero!: string;
    complemento!: string;
    senha!: string;
    role: string = 'USER';

    constructor(dados: Partial<User>) {
        Object.assign(this, dados);
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
        localStorage.setItem("user", JSON.stringify(users) )
        return true
    },

    loginuser (login:Login):{ sucesso: boolean; role?: string }{
        const atual=localStorage.getItem("user")
        const users:User[] = atual ? JSON.parse(atual) : [];
        const usuario = users.find(us => us.email === login.email && us.senha === login.senha)
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