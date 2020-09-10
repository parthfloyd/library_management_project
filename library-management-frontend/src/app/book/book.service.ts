import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Book} from '../models/book.model';
import {Category} from '../models/category.model';
import {map} from 'rxjs/operators';


interface BookPaginated{
    count: number;
    rows: Book[]
}
@Injectable({
    providedIn: 'root'
})
export class BookService {
    url = 'http://localhost:3000'; //backend domain url

    constructor(private http: HttpClient) { }

    //get Categories name as an array
    getCategories() {
        return this.http.get<Category[]>(`${this.url}/categories`,{responseType: 'json'})
            .pipe(map(data => {
                let categories = []
                for(let category of data){
                    if(+category.category_level === 0){
                        categories.push(category.category_name)
                    }
                }
                return categories;
            }));
    }

    //get book paginated
    getBooksPaginated(offset){
        let books = [];
        return this.http.get<BookPaginated>(`${this.url}/books/pages/${offset}`,{responseType: 'json'})
            .pipe(map(data => {
                books = data.rows.slice(0);
                return books;
            },(err) => {
                books = []; 
                return books;
            }));
    }

    //Get single book details
    getBookDetails(id) {
        return this.http.get<Book>(`${this.url}/books/details/${id}`, {responseType: 'json'})
        .pipe(
            map( data => {
                let authors = [];
                let categories = [];

                for (let author of data.Authors){
                    authors.push(author.name);
                }

                for (let category of data.Categories){
                    categories.push(category.category_name)
                }

                return {
                    ...data,
                    Authors: authors,
                    Categories: categories
                }
            })
        )
    }
    //Get book of same category
    getBookByCategory(category){
        return this.http.get<Book[]>(`${this.url}/books/category/${category}`,{responseType: 'json'});
    }

}