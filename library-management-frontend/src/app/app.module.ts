import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BookComponent } from './book/book.component';
import { BooksViewComponent } from './book/books-view/books-view.component';
import { BookDetailsComponent } from './book/book-details/book-details.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

import {ShortenPipe} from './shorten.pipe';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { CreateBookComponent } from './admin-dashboard/create-book/create-book.component';
import { UserManagementComponent } from './admin-dashboard/user-management/user-management.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    BookComponent,
    BooksViewComponent,
    BookDetailsComponent,
    UserProfileComponent,
    ShortenPipe,
    AdminDashboardComponent,
    CreateBookComponent,
    UserManagementComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
