//This fetches the data for new or un verified user side panel
import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { User } from '../../models/user.model';
import { UserDataService } from 'src/app/user-profile/user-data.service';

@Injectable({providedIn: 'root'})
export class UserManageDataResolverService implements Resolve<User>{
    constructor(private userDataService: UserDataService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        let userId = route.paramMap.get('id');
        if(+userId <= 0){
            return null;
        } else {
            const user = this.userDataService.completeUserData(userId);
            return user;
        }
    }
}