import {Injectable} from '@angular/core';
import { HttpClient, HttpUrlEncodingCodec } from '@angular/common/http';
import {Book} from '../models/book.model';
import {Category} from '../models/category.model';
import {map} from 'rxjs/operators';
import { AuthService } from '../auth.service';
import {environment} from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';


interface BookPaginated{
    count: number;
    rows: Book[]
}
@Injectable({
    providedIn: 'root'
})
export class BookService {
    books: Book[] = null;
    bookDataSubject : BehaviorSubject<Book[]> = new BehaviorSubject(null);
    url = environment.apiURL; //backend domain url

    constructor(private http: HttpClient, private authService: AuthService) { }

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

    //get book paginated for main book view
    getBooksPaginated(offset){
        return this.http.get<BookPaginated>(`${this.url}/books/pages/${offset}`,{responseType: 'json'})
            .pipe(map(data => {
                this.books = data.rows.slice(0);
                this.bookDataSubject.next(this.books);
                return this.books;
            },(err) => {
                this.books = []; 
                return this.books;
            }));
    }

    //get books by author
    getBooksByAuthor(authorName){
        let authorNameEncoded = encodeURI(authorName);
        return this.http.get<Book[]>(`${this.url}/books/author/${authorNameEncoded}`,{responseType: 'json'});
    }

    //Get book by category
    getBooksByCategory(category){
        return this.http.get<Book[]>(`${this.url}/books/category/${category}`,{responseType: 'json'});
    }

    //Get book by name
    getBooksByName(name){
        return this.http.get<Book[]>(`${this.url}/books/name/${name}`,{responseType: 'json'});
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
    

    //issue a book
    issueBookById(id){
        return this.http.post(`${this.url}/users/${this.authService.user.id}`,{bookId: id},{headers: this.authService.headers, responseType: 'json'});
    }

    //check if user has a book
    checkBookById(id){
        return this.http.get(`${this.url}/users/${this.authService.user.id}/hasbook/${id}`,{headers: this.authService.headers, responseType: 'json'});
    }

    //return book by id
    returnBookById(id){
        return this.http.get(`${this.url}/users/${this.authService.user.id}/returnbook/${id}`,{headers: this.authService.headers, responseType: 'json'});
    }
}