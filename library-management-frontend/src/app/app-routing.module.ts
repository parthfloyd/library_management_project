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
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { CreateBookComponent} from './admin-dashboard/create-book/create-book.component';
import { UserManagementComponent} from './admin-dashboard/user-management/user-management.component';
import { UserManageResolverService} from './admin-dashboard/user-management/user-manage-resolver.service';
import { UserManageDataResolverService} from './admin-dashboard/user-management/user-manage-data-resolver.service';

const routes: Routes = [
  {path:'', redirectTo: '/books', pathMatch:'full'},
  {path:'login', component: LoginComponent},
  {path:'register', component: RegisterComponent},
  {path:'books', component: BookComponent,
    children: [
      {path: '', component: BooksViewComponent},
      {path: 'details/:id', component: BookDetailsComponent, resolve: {book: BookDetailsResolverService, hasBook: BookDetailsResolverUserService}}
    ]},
  {path:'user', component: UserProfileComponent, resolve: {userData: UserDataResolverService}},
  {path:'admin/dashboard', component: AdminDashboardComponent, 
    children: [
      {path: 'createbook', component: CreateBookComponent},
      {path: 'usermanagement/:id', component: UserManagementComponent, 
          resolve: 
            {
              unverifiedUsers: UserManageResolverService, 
              userData: UserManageDataResolverService
            }
      }
    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
