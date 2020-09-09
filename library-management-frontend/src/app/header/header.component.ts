import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userType: string = "None";
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.userRoleChanged.subscribe((userType) => {
      this.userType = userType;
    })
  }

  logout() {
    this.authService.logout();
  }
}
