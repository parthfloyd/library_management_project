import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AuthService} from '../auth.service';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AdminService{
    url = environment.apiURL;

    constructor(private authService: AuthService, private http: HttpClient){}

    //Create New Book
    createBook(data){
        return this.http.post(`${this.url}/book`,data,{headers: this.authService.headers ,responseType: 'json'});
    }

    //Find Unverified User
    getUnverifiedUsers(){
        return this.http.get<User[]>(`${this.url}/users/unverified`,{headers: this.authService.headers, responseType: 'json'});
    }
    //delete user
    deleteUserById(id){
        return this.http.delete(`${this.url}/users/${id}`,{headers: this.authService.headers, responseType: 'text'});
    }

    // get userid by email:
    getUserIdByEmail(email){
        let encodedEmail = encodeURI(email);
        return this.http.get(`${this.url}/users/email/${encodedEmail}`,{headers: this.authService.headers, responseType: 'json'});
    }

    //get users by name search
    getUserIdByPhone(phone){
        return this.http.get(`${this.url}/users/phone/${phone}`,{headers: this.authService.headers, responseType: 'json'});
    }
}