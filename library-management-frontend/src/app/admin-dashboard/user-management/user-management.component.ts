import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDataService } from 'src/app/user-profile/user-data.service';
import { AdminService } from '../admin.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BookService } from 'src/app/book/book.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  searchForm: FormGroup
  unverifiedUsers = null;
  user = null;
  constructor(private activatedRoute: ActivatedRoute, private userDataService: UserDataService, 
      private router: Router, private adminService: AdminService, private bookService: BookService) { }

  ngOnInit(): void {
    //Fetch unverified users from resolver
    this.activatedRoute.data.subscribe((data:{unverifiedUsers: User[]})=> {
      this.unverifiedUsers = data.unverifiedUsers;
      console.log(this.unverifiedUsers);
    });

    //Fetch userdata
    this.activatedRoute.data.subscribe((data:{userData: User})=> {
      this.user = data.userData;
      console.log(this.user);
    });

    //search user form
    this.searchForm = new FormGroup({
      'searchQuery': new FormControl(null, [Validators.required]),
      'searchBy': new FormControl("byId", Validators.required)
    });
  }
  //Search users ----->
  searchUsers(){
    let query = this.searchForm.value.searchQuery;
    let searchBy = this.searchForm.value.searchBy;
    if(searchBy ==="byId"){
      this.router.navigate(['./admin/dashboard/usermanagement/'+query]);
    } else if(searchBy ==="byEmail"){
      this.adminService.getUserIdByEmail(query).subscribe((data: {id: number})=>{
        if(data){
          this.router.navigate(['./admin/dashboard/usermanagement/'+data.id]);
        } else {
          alert("Couldn`t find the user, please check query!")
        }
      })
    } else if(searchBy === "byPhone"){
      this.adminService.getUserIdByPhone(query).subscribe((data: {id: number})=>{
        if(data){
          this.router.navigate(['./admin/dashboard/usermanagement/'+data.id]);
        } else {
          alert("Couldn`t find the user, please check query!")
        }
      })
    }
  }

  //Approve Application ---->
  approveApplication(id){
    this.userDataService.updateUserData({is_verified: true},id).subscribe(data => {
      alert("User Approved Successfully!");
      this.router.navigate(['./admin/dashboard/usermanagement/0']);
    }, err => {
      alert("Sorry unable to approve user, please try again later!");
    });
  } //todo send an email acknowledging approval

  rejectApplication(id){
    this.adminService.deleteUserById(+id).subscribe(data => {
      alert("User Rejected Successfully!");
      this.router.navigate(['./admin/dashboard/usermanagement/0']);
    }, err => {
      alert("Sorry unable to delete user");
    })
  } //todo send an email rejecting application

  //Return book of a user
  returnBook(bookId, userId, index){
    this.bookService.returnBookById(bookId,userId).subscribe((data: {message: string})=> {
      alert(data.message);
      this.router.navigate(['./admin/dashboard/usermanagement/0']);
    }, err=> {
      alert("Sorry some error encountered, please try again later!");
    })
  }
}
