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
    this.http.post<ResponseDataUser>(`${this.url}/login`,{
      email: credentials.email,
      password: credentials.password
    },{
      responseType: 'json'
    }).subscribe( data => {
      this.token = data.token.token_value;
      this.user = data.user;
      if(this.user.admin_flag){
        this.userType = "ADMIN";
      } else {
        this.userType = "USER";
      }
      this.userRoleChanged.next(this.userType);
      this.router.navigate(['/books']);
    },err => {
      alert("Please check your credentials!");
    });
  }
    
  register = async(credentials) => {
    const adminFlag = credentials.userType === "ADMIN";
    this.http.post<{message}>(`${this.url}/register`,{
      name: credentials.name,
      email: credentials.email,
      phone: credentials.phone,
      password: credentials.password,
      identity_proof_url: credentials.identity_proof_url,
      date_of_birth: credentials.date_of_birth,
      admin_flag: adminFlag
    },{
      responseType: "json"
    }).subscribe( message => {
      alert(message.message);
      this.router.navigate(['/books']);
    },err => {
      alert("Please check your data!");
    });

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
