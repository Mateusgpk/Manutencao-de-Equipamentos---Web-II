
export class User {
    name: string;
    email: string;
    constructor (name:string,email:string){
        this.name=name
        this.email=email
    }

}


export const auth = {
    registerUser(user: User): boolean{
        localStorage.setItem( "user" , JSON.stringify(user) )
        return true
    }
}