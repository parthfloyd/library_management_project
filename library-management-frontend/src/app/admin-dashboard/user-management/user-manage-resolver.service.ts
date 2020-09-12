//This fetches the data for new or un verified user side panel
import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { User } from '../../models/user.model';
import { AdminService } from '../admin.service';

@Injectable({providedIn: 'root'})
export class UserManageResolverService implements Resolve<User[]>{
    constructor(private adminService: AdminService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        
        const unverifiedUsers = this.adminService.getUnverifiedUsers();
        return unverifiedUsers;
        // const book = this.bookService.getBookDetails(route.paramMap.get('id'));
        // return book;
    }
}