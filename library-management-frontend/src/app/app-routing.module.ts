import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BookComponent } from './book/book.component';
import { BooksViewComponent } from './book/books-view/books-view.component';
import { BookDetailsComponent } from './book/book-details/book-details.component';
import { BookDetailsResolverService } from './book/book-details/book-details-resolver.service';
import { BookDetailsResolverUserService } from './book/book-details/book-details-resolver-user.service';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserDataResolverService} from './user-profile/user-data-resolver.service';

const routes: Routes = [
  {path:'', redirectTo: '/books', pathMatch:'full'},
  {path:'login', component: LoginComponent},
  {path:'register', component: RegisterComponent},
  {path:'books', component: BookComponent,
    children: [
      {path: '', component: BooksViewComponent},
      {path: 'details/:id', component: BookDetailsComponent, resolve: {book: BookDetailsResolverService, hasBook: BookDetailsResolverUserService}}
    ]},
  {path:'user', component: UserProfileComponent, resolve: {userData: UserDataResolverService}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
