import { Component, OnInit } from '@angular/core';
import { BookService } from './book.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  categories = null;
  searchForm: FormGroup;

  constructor(private bookService : BookService, private router: Router) { }

  ngOnInit(): void {

    //Fetching categories
    this.bookService.getCategories().subscribe((categories)=>{
      this.categories = categories;
    });

    this.searchForm = new FormGroup({
      'searchQuery': new FormControl(null, [Validators.required]),
      'searchBy': new FormControl("bookName", Validators.required)
    });
    
  }

  searchBooks(){
    let query = this.searchForm.value.searchQuery;
    let searchBy = this.searchForm.value.searchBy;
    
    if (searchBy ==="bookName"){
      this.bookService.getBooksByName(query).subscribe(
        books => {
          this.bookService.bookDataSubject.next(books);
        },
        err => {
          alert("No books found of this Name!");
        }
      )
    }
    else if(searchBy === "authorName"){
      this.bookService.getBooksByAuthor(query).subscribe(
        books => {
          this.bookService.bookDataSubject.next(books);
        },
        err => {
          alert("No books found for the Author!");
        }
      );
    } else if(searchBy === "categoryName"){
      this.bookService.getBooksByCategory(query).subscribe(
        books => {
          this.bookService.bookDataSubject.next(books);
        },
        err => {
          alert("No books found under this category!");
        }
      )
    }
    //Redirecting to books page if in details
    this.router.navigate(['./books']);
  }

  loadAllBooks(){
    this.bookService.bookDataSubject.next(this.bookService.books);
    //Redirecting to books page if in details
    this.router.navigate(['./books']);
  }


}
