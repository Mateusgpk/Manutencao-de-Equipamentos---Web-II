export class User {
    id!: string ;
    active:boolean=true;
    email!: string;
    password!: string;
    role!: string;
    constructor (dados: Partial<User>){
        Object.assign(this, dados);
    }
}