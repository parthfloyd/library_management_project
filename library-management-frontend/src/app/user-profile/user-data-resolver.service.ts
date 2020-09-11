import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {User} from '../models/user.model';
import {UserDataService} from './user-data.service';
import {AuthService} from '../auth.service';

@Injectable({providedIn: 'root'})
export class UserDataResolverService implements Resolve<any>{
    constructor(private userDataService: UserDataService, private authService: AuthService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        const userData = this.userDataService.completeUserData(this.authService.user.id);
        return userData;
    }
}