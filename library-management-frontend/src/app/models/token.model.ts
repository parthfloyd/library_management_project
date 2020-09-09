export class Token {
    public id: number;
    public token_value: string;
    public updatedAt: string;
    public createdAt: string;

    constructor(id: number, token_value: string, updatedAt: string, createdAt: string){
        this.id = id;
        this.token_value = token_value;
        this.updatedAt  = updatedAt;
        this.createdAt = createdAt;
    }
}