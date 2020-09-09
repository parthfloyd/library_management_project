export class Admin {
    public id: number;
    public name: string;
    public email: string;
    public phone: string;
    public password: string;
    public createdAt: string;
    public updatedAt: string;

    constructor(id: number, name: string, email: string, phone: string, password: string,
            createdAt: string, updatedAt: string) {
                this.id = id;
                this.name = name;
                this.email = email;
                this.phone = phone;
                this.password= password;
                this.createdAt = createdAt;
                this.updatedAt = updatedAt
            }
}

