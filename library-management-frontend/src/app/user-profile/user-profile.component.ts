import { Component, OnInit } from '@angular/core';
import {UserDataService} from './user-data.service';
import {AuthService} from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.model';
import { Book } from '../models/book.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userData = null;
  lendedBooks = [];
  dataLoaded = false;
  lateBookDate = new Date().getDate() - 14;

  //Edit profile form
  editProfileForm: FormGroup;
  constructor(private activatedRoute: ActivatedRoute, private userDataService: UserDataService, private authService: AuthService
      ,private router: Router) { }

  ngOnInit(): void {
    //Fetching user data
    this.activatedRoute.data.subscribe((data: {userData: User})=> {
      this.userData = data.userData;
      if(data.userData.books.length>0){
        for(let book of data.userData.books){
          let completeBookData;
          if (+book.UserBooks.createdAt <= this.lateBookDate){
            completeBookData = {
              ...book,
              lateBook: true
            }
          } else {
            completeBookData = {
              ...book,
              lateBook:false
            }
          }
          this.lendedBooks.push(completeBookData);
        }
        console.log(this.lendedBooks);
        console.log(this.lendedBooks[0].UserBooks.createdAt);
        console.log(this.userData);
      }
      
      this.dataLoaded = true;
    });

    //Initializing form
    this.editProfileForm = new FormGroup({
      'name': new FormControl(this.userData.name, Validators.required),
      'email': new FormControl(this.userData.email, [Validators.required, Validators.email]),
      'password': new FormControl("", Validators.required),
      'phone': new FormControl(this.userData.phone, Validators.required),
      'date_of_birth': new FormControl(this.userData.date_of_birth),
      'identity_proof_url': new FormControl(this.userData.identity_proof_url),
    });
  }

  onSubmit(): void {
    this.userDataService.updateUserData(this.editProfileForm.value).subscribe((data: {User,identityChanged: boolean, emailChanged: boolean})=> {
      if(data.emailChanged || data.identityChanged){
        this.authService.user = null;
        this.authService.headers = null;
        this.authService.token = null;
        this.authService.userType = "NONE";
        let alertMessage = !data.identityChanged ? "Your email has been changed successfully, please login again": "Your identity proof has been changed, please wait for admin`s approval!"
        alert(alertMessage);
        this.router.navigate(['/login']);
        
      } else {
        alert("Congratulations! Data changed successfully");
      }
    })
  }
}
