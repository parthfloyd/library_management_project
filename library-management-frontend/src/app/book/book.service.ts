import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ArrayType } from '@angular/compiler';

interface Category{
    id: number;
    category_name: string;
    category_level: number;
    category_under: string;
    createdAt: string;
    updatedAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class BookService {
    url = 'http://localhost:3000'; //backend domain url
    categories = [];

    constructor(private http: HttpClient) { }
    getCategories = async() => {
        this.http.get<Category[]>(`${this.url}/categories`,{responseType: 'json'})
            .subscribe(data => {
                this.categories = []
                for(let category of data){
                    if(+category.category_level === 0){
                        this.categories.push(category.category_name)
                    }
                }
            });
        return this.categories;
    }
}