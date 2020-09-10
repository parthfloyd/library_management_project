export class User {
    public id: number;
    public name: string;
    public email: string;
    public phone: string;
    public password: string;
    public admin_flag: boolean;
    public identity_proof_url: string;
    public date_of_birth: string;
    public createdAt: string;
    public updatedAt: string;
    public is_verified: boolean;

    constructor(id: number, name: string, email: string, phone: string, password: string, identity_proof_url: string, date_of_birth: string,
            createdAt: string, updatedAt: string, admin_flag: boolean, is_verified: boolean) {
                this.id = id;
                this.name = name;
                this.email = email;
                this.phone = phone;
                this.password= password;
                this.identity_proof_url = identity_proof_url;
                this.date_of_birth = date_of_birth;
                this.createdAt = createdAt;
                this.updatedAt = updatedAt;
                this.admin_flag = admin_flag;
                this.is_verified = is_verified;

            }
}

