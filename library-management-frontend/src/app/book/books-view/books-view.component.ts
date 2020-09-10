import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';

@Component({
  selector: 'app-books-view',
  templateUrl: './books-view.component.html',
  styleUrls: ['./books-view.component.css']
})
export class BooksViewComponent implements OnInit {
  books = null;
  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    this.bookService.getBooksPaginated(0).subscribe((books)=> {
      this.books = books;
      console.log(this.books);
    })
  }

}
