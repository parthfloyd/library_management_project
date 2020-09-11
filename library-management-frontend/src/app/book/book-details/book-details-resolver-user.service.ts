import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import { BookService } from '../book.service';
import {Book} from '../../models/book.model';
import { AuthService } from 'src/app/auth.service';

@Injectable({providedIn: 'root'})
export class BookDetailsResolverUserService implements Resolve<any>{
    constructor(private bookService: BookService, private authService: AuthService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        if(this.authService.userType !== "NONE"){
            const hasBook = this.bookService.checkBookById(route.paramMap.get('id'));
            return hasBook;
        }
    }
}