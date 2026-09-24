import { User } from "../../../shared/models/user.model";

export class Client {
    name!: string;
    cpf!: string;
    cep!: string;
    endereco!: string;
    estado!: string;
    cidade!: string;
    bairro!: string;
    numero!: string;
    complemento!: string;
    user!: User;
    constructor(dados: Partial<Client>) {
        Object.assign(this, dados);
    }
}