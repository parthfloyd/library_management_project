import { Component, OnInit } from '@angular/core';
import { BookService } from './book.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  categories = null;
  constructor(private bookService : BookService) { }

  ngOnInit(): void {
    this.bookService.getCategories().subscribe((categories)=>{
      this.categories = categories;
    });
    
  }

}
