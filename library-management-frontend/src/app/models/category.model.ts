export class Category{
    id: number;
    category_name: string;
    category_level: number;
    category_under: string;
    createdAt: string;
    updatedAt: string;

    constructor(id: number, category_name: string, category_level: number, category_under: string, createdAt: string, updatedAt: string){
        this.id = id;
        this.category_name = category_name;
        this.category_level = category_level;
        this.category_under = category_under;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}