import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { map } from 'rxjs/operators';
import { BookService } from '../book.service';
import { Book } from 'src/app/models/book.model';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  userType = this.authService.userType;
  userHasBook: boolean = false;
  book:Book;
  books: Book[];
  isBookLoaded = false;
  isCategoryLoaded = false;
  id = null;
  constructor(private activatedRoute: ActivatedRoute, private bookService: BookService, private authService: AuthService) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: {book : Book}) => {
      this.book = data.book;
      this.isBookLoaded = true;
      });

      this.activatedRoute.data.subscribe((data: {hasBook : {hasBook: boolean}}) => {
        if(this.userType !== "NONE"){
          this.userHasBook = data.hasBook.hasBook;
        }
        });
    
    // if(this.userType !== "NONE"){
    //     this.bookService.checkBookById(this.book.id).subscribe((data: {hasBook: boolean})=>{
    //       this.userHasBook = data.hasBook;
    //       console.log(this.userHasBook)
    //     });
    // }
    this.bookService.getBooksByCategory(this.book.Categories[0]).subscribe(books => {
      this.books = books;
      this.isCategoryLoaded=true;
    });
  }


  issueBook(id){
    this.bookService.issueBookById(id).subscribe((data : {message: string}) => {
      alert(data.message);
      this.userHasBook = true;
    }, ((data)=> {
      alert(data.error.message);
    }));
  }

  returnBook(id){
    this.bookService.returnBookById(id).subscribe((data : {message: string}) => {
      alert(data.message);
      this.userHasBook = false;
    }, ((data)=> {
      alert(data.error.message);
    }));
  }
}
