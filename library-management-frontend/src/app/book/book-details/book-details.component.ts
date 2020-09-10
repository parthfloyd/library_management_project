import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { map } from 'rxjs/operators';
import { BookService } from '../book.service';
import { Book } from 'src/app/models/book.model';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  book:Book;
  books: Book[];
  isBookLoaded = false;
  isCategoryLoaded = false;
  id = null;
  constructor(private route: ActivatedRoute, private bookService: BookService) { }

  ngOnInit(): void {
    //Fetching id from the url
    this.route.url.
    pipe(
      map( (urlSegment: UrlSegment[]) => {
        return urlSegment[1].path
      })
    )
    .subscribe(id => {
      this.id = id;
    });

    //Fetching book using id
    this.bookService.getBookDetails(this.id).subscribe(book => {
      this.book = book;
      this.isBookLoaded = true;
    });
  }
    // this.bookService.getBookByCategory(this.book.Categories[0]).subscribe(books => {
    //   this.books = books;
    //   this.isCategoryLoaded=true;
    // });
}
