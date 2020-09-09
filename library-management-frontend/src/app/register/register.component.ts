import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, Validators.required),
      'phone': new FormControl(null, Validators.required),
      'date_of_birth': new FormControl(null),
      'identity_proof_url': new FormControl(null),
      'userType': new FormControl('USER')
    });
  }

  onSubmit(): void {
    this.authService.register(this.registerForm.value);
  }

}
