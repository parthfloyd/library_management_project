import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';

@Component({
  selector: 'app-books-view',
  templateUrl: './books-view.component.html',
  styleUrls: ['./books-view.component.css']
})
export class BooksViewComponent implements OnInit {
  books = null;
  page = 0;
  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    this.bookService.getBooksPaginated(this.page*12).subscribe((books)=> {
      if(this.books === null){
        this.books = books;
        console.log(this.books);
      }

    });

    this.bookService.bookDataSubject.subscribe((books) => {
      this.books = books;
    })
  }

}
