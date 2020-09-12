import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  searchForm: FormGroup;

  constructor(private router: Router) { }

  ngOnInit(): void {
    //searchbook form
    this.searchForm = new FormGroup({
      'bookId': new FormControl(null, [Validators.required]),
    });
  }

  searchBook(){
    let bookId = this.searchForm.value.bookId;
    this.router.navigate(['./admin/dashboard/createbook/'+bookId]);
  }

}
