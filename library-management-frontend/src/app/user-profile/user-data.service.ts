import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {environment} from '../../environments/environment';
import {AuthService} from '../auth.service';
@Injectable({
    providedIn: 'root'
})
export class UserDataService {
    url = environment.apiURL;
    constructor(private authService: AuthService, private http: HttpClient){}

    completeUserData(id) {
        return this.http.get(`${this.url}/users/${id}`,{headers: this.authService.headers, responseType: 'json'});
    }

    updateUserData(data){
        return this.http.patch(`${this.url}/users/${this.authService.user.id}`,data,{headers: this.authService.headers, responseType:'json'});
    }
}