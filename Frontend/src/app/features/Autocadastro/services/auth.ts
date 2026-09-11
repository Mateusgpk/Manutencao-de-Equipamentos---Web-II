
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
        const users: User[]= atual? JSON.parse(atual) :[]
        const emailemuso= users.some(u=>u.email===user.email)
        if (emailemuso){
            return false;
        }
        users.push(user)
        localStorage.setItem( "user" ,JSON.stringify(users) )
        return true
    },

    loginuser (user:User):boolean{
        const atual=localStorage.getItem("user")
        const users:User[] = atual ? JSON.parse(atual) : [];
        return users.some(us => us.email === user.email && us.name === user.name)
    }
}