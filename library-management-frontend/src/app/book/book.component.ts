import { Component, OnInit } from '@angular/core';
import { BookService } from './book.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  categories = [];
  constructor(private bookService : BookService) { }

  ngOnInit(): void {
    this.bookService.getCategories().then((categories)=>{
      this.categories = categories;
    })
    
  }

}
