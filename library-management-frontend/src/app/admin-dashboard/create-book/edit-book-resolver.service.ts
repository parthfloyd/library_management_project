//This fetches the book data  to edit
import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Book} from '../../models/book.model';
import {BookService} from '../../book/book.service';


@Injectable({providedIn: 'root'})
export class EditBookResolverService implements Resolve<Book>{
    constructor(private bookService: BookService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        const book = this.bookService.getBookDetails(route.paramMap.get('id'));
        return book;
    }
}