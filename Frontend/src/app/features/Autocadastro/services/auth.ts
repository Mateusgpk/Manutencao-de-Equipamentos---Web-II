
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
        const atual=localStorage.getItem("user")
        localStorage.setItem( "user" , atual+JSON.stringify(user) )
        return true
    }
}