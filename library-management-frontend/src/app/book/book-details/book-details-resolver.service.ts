import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import { BookService } from '../book.service';
import {Book} from '../../models/book.model';

@Injectable({providedIn: 'root'})
export class BookDetailsResolverService implements Resolve<Book>{
    constructor(private bookService: BookService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        const book = this.bookService.getBookDetails(route.paramMap.get('id'));
        return book;
    }
}