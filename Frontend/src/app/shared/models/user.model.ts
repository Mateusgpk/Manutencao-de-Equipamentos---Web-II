export class User {
    email!: string;
    password!: string;
    role!: string;
    constructor (email:string,password:string){
        this.email=email;
        this.password=password;
    }
}