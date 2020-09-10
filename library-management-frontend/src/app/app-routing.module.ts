import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BookComponent } from './book/book.component';
import { BooksViewComponent } from './book/books-view/books-view.component';
import { BookDetailsComponent } from './book/book-details/book-details.component';

const routes: Routes = [
  {path:'', redirectTo: '/books', pathMatch:'full'},
  {path:'login', component: LoginComponent},
  {path:'register', component: RegisterComponent},
  {path:'books', component: BookComponent, children: [
      {path: '', component: BooksViewComponent},
      {path: 'details/:id', component: BookDetailsComponent}
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
