import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {environment} from '../../environments/environment';
import {AuthService} from '../auth.service';
import { User } from '../models/user.model';
@Injectable({
    providedIn: 'root'
})
export class UserDataService {
    url = environment.apiURL;
    constructor(private authService: AuthService, private http: HttpClient){}

    completeUserData(id) {
        return this.http.get<User>(`${this.url}/users/${id}`,{headers: this.authService.headers, responseType: 'json'});
    }

    updateUserData(data,userId = this.authService.user.id){
        return this.http.patch(`${this.url}/users/${+userId}`,data,{headers: this.authService.headers, responseType:'json'});
    }
}