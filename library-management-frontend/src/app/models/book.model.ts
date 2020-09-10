import { Category } from './category.model';
import { Author } from './author.model';

export class Book {
    public id: number;
    public name: string;
    public pages: number;
    public release_year: number;
    public publication: string;
    public stock_quantity: number;
    public cover_image_url: string;
    public createdAt: string;
    public updatedAt: string;
    public Categories: Category[];
    public Authors: Author[];

    constructor(id: number, name: string, pages: number, release_year: number, publication: string, stock_quantity: number, cover_image_url: string,
            createdAt: string, updatedAt: string, Categories: Category[], Authors: Author[] ){
                this.id = id;
                this.name = name;
                this.pages = pages;
                this.release_year = release_year;
                this.publication = publication;
                this.stock_quantity =stock_quantity;
                this.cover_image_url = cover_image_url;
                this.createdAt = createdAt;
                this.updatedAt = updatedAt;
                this.Categories = Categories;
                this.Authors = Authors
    }
}