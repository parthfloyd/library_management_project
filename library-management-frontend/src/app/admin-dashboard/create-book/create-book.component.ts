import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormArray, FormBuilder } from '@angular/forms';
import {AdminService} from '../admin.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Book } from 'src/app/models/book.model';
@Component({
  selector: 'app-create-book',
  templateUrl: './create-book.component.html',
  styleUrls: ['./create-book.component.css']
})
export class CreateBookComponent implements OnInit {
  createBookForm: FormGroup;
  dataLoaded=  false;
  editMode = false;
  bookId = null;
  constructor(private formBuilder: FormBuilder, private adminService: AdminService, 
    private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    let name = null;
    let pages = null;
    let release_year = null;
    let publication = null;
    let stock_quantity = null;
    let cover_image_url = null;
    let authors = this.formBuilder.array([]);
    let categories = this.formBuilder.array([]);
    //fetching data from resolver
    this.activatedRoute.data.subscribe((data: {book: Book})=> {
      if(data.book){ //means user is in edit mode
        let book = data.book;
        this.bookId = book.id;
        //adding values to input variables
        name = book.name;
        pages = book.pages;
        release_year = book.release_year;
        publication = book.publication;
        stock_quantity = book.stock_quantity;
        cover_image_url = book.cover_image_url;
        console.log(book);
        console.log(book.Authors);
        //adding values to author
        for(let author of book.Authors){
          authors.push(
            this.formBuilder.group({
              author: [author, Validators.required]
            }));
        }
        //adding values to author
        for(let category of book.Categories){
          categories.push(
            this.formBuilder.group({
              category: [category, Validators.required]
            }));
        }
        this.editMode = true;
      } else {
        this.editMode = false;
      }

      this.createBookForm = new FormGroup({
        'name': new FormControl(name, Validators.required),
        'pages': new FormControl(pages, Validators.required),
        'release_year': new FormControl(release_year, Validators.required),
        'publication': new FormControl(publication, Validators.required),
        'stock_quantity': new FormControl(stock_quantity, Validators.required),
        'cover_image_url': new FormControl(cover_image_url, Validators.required),
        'authors': authors,
        'categories': categories
      });
      if(!this.editMode){
        const authorFormArray = this.createBookForm.get('authors') as FormArray;
        this.addNewAuthor();
        const categoryFormArray = this.createBookForm.get('categories') as FormArray;
        this.addNewCategory();
      }
      

      this.dataLoaded = true;

    },err => {
      alert("Error Encountered, Book Not Available")
    });


    
  }

  //Author Array
  addNewAuthor(){
    const authorFormArray = this.createBookForm.get('authors') as FormArray;
    authorFormArray.push(this.formBuilder.group({
      author: ['', Validators.required]
    }));
  }

  deleteAuthor(i: number){
    const authorFormArray = this.createBookForm.get('authors') as FormArray;
    authorFormArray.removeAt(i);
    if(authorFormArray.length === 0) this.addNewAuthor();
  }

  get authorControls() { // a getter!
    return (<FormArray>this.createBookForm.get('authors')).controls;
  }

  //Category Array
  addNewCategory(){
    const categoryFormArray = this.createBookForm.get('categories') as FormArray;
    categoryFormArray.push(this.formBuilder.group({
      category: ['', Validators.required]
    }));
  }

  deleteCategory(i: number){
    const categoryFormArray = this.createBookForm.get('categories') as FormArray;
    categoryFormArray.removeAt(i);
    if(categoryFormArray.length === 0) this.addNewCategory();
  }

  get categoryControls() { // a getter!
    return (<FormArray>this.createBookForm.get('categories')).controls;
  }

  // Finally Update or create book
  onSubmit(){
    let formBookData = this.createBookForm.value;
    let authorArray = [];
    for (let authorObj of formBookData.authors){
        authorArray.push(authorObj.author);
    }
    let categoryArray =[];
    for(let categoryObj of formBookData.categories){
        categoryArray.push(categoryObj.category);
    }

    formBookData = {
      ...formBookData,
      authors: authorArray,
      category: categoryArray
    }
    //create book
    if(this.editMode){
      this.adminService.updateBook({id: this.bookId,book: formBookData}).subscribe((data)=>{
        alert("Book Created Successfully!");
        this.router.navigate(['./admin/dashboard']);
      }, err => {
        alert("Sorry the book wasn`t created! Please try again")
      })
    }
    else{
      this.adminService.createBook(formBookData).subscribe((data)=>{
        alert("Book Created Successfully!");
        this.router.navigate(['./admin/dashboard']);
      }, err => {
        alert("Sorry the book wasn`t created! Please try again")
      })
    }
    console.log(formBookData);
    
  }

  
}
