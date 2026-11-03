// shared/models/user.model.ts
export class User {
    id?: number;
    email!: string;
    password!: string;
    ativo?: boolean; 
    role!: string; 

    constructor(dados: Partial<User>) {
        Object.assign(this, dados);
    }
}