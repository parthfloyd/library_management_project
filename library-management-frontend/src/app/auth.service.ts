import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {User} from './models/user.model';
import {Admin} from './models/admin.model';
import {Token} from './models/token.model';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

interface ResponseDataUser{
  user: User,
  token: Token
}
interface ResponseDataAdmin{
  admin: Admin,
  token: Token
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = 'http://localhost:3000'; //backend domain url
  user: User = null;
  admin: Admin = null;
  userType: string = null;
  token:string = null;
  userRoleChanged : BehaviorSubject<string> = new BehaviorSubject("NONE");
  constructor(private http: HttpClient, private router: Router) { }

  //LOGIN FUNCTION FOR USER AND ADMIN.
  login = async(credentials) => {
    if(credentials.userType == "USER"){ //LOGGING IN FOR THE USER
      this.http.post<ResponseDataUser>(`${this.url}/loginuser`,{
        email: credentials.email,
        password: credentials.password
      },{
        responseType: 'json'
      }).subscribe( data => {
        this.token = data.token.token_value;
        this.user = data.user;
        this.userType = credentials.userType;
        this.userRoleChanged.next(this.userType);
        this.router.navigate(['/books']);
      },err => {
        alert("Please check your credentials!");
      });
    }
    else { //LOGGING IN FOR THE ADMIN
      this.http.post<ResponseDataAdmin>(`${this.url}/loginadmin`,{
        email: credentials.email,
        password: credentials.password
      },{
        responseType: 'json'
      }).subscribe( data => {
        this.token = data.token.token_value;
        this.admin = data.admin;
        this.userType = credentials.userType;
        this.userRoleChanged.next(this.userType);
        this.router.navigate(['/books']);
      },err => {
        alert("Please check your credentials!");
      });
    }
      
  }
    
  register = async(credentials) => {
    if(credentials.userType == "USER"){ //Registering IN FOR THE USER
      this.http.post<ResponseDataUser>(`${this.url}/registeruser`,{
        name: credentials.name,
        email: credentials.email,
        phone: credentials.phone,
        password: credentials.password,
        identity_proof_url: credentials.identity_proof_url,
        date_of_birth: credentials.date_of_birth
      },{
        responseType: 'json'
      }).subscribe( data => {
        this.token = data.token.token_value;
        this.user = data.user;
        this.userType = credentials.userType;
        this.userRoleChanged.next(this.userType);
        this.router.navigate(['/books']);
      },err => {
        alert("Please check your data!");
      });
    }
    else { //Registering IN FOR THE ADMIN
      this.http.post<ResponseDataAdmin>(`${this.url}/loginadmin`,{
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        phone: credentials.phone
      },{
        responseType: 'json'
      }).subscribe( data => {
        this.token = data.token.token_value;
        this.admin = data.admin;
        this.userType = credentials.userType;
        this.userRoleChanged.next(this.userType);
        this.router.navigate(['/books']);
      },err => {
        alert("Please check your data!");
      });
    }

  }

  logout = async() => {
      //Authentication token to the header
      let headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`});

      if(this.userType == "ADMIN"){
        this.http.post(`${this.url}/logoutAdmin`,{},{
          headers: headers,
          responseType: 'text'
        }).subscribe( ()=> {
          this.token = null;
          this.admin = null;
          this.userType = "NONE";
          this.userRoleChanged.next(this.userType);
          this.router.navigate(['/login']);
        });
      } else if (this.userType == "USER") {
        this.http.post(`${this.url}/logoutuser`,null,{
          headers: headers,
          responseType: 'text'
        }).subscribe(()=> {
          this.token = null;
          this.user = null;
          this.userType = "NONE";
          this.userRoleChanged.next(this.userType);
          this.router.navigate(['/login']);
        });
      }

  }
}
