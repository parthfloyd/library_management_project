import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormArray, FormBuilder } from '@angular/forms';
import {AdminService} from '../admin.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-book',
  templateUrl: './create-book.component.html',
  styleUrls: ['./create-book.component.css']
})
export class CreateBookComponent implements OnInit {
  createBookForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private adminService: AdminService, private router: Router) { }

  ngOnInit(): void {
    this.createBookForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'pages': new FormControl(null, Validators.required),
      'release_year': new FormControl(null, Validators.required),
      'publication': new FormControl(null, Validators.required),
      'stock_quantity': new FormControl(null, Validators.required),
      'cover_image_url': new FormControl(null, Validators.required),
      'authors': this.formBuilder.array([]),
      'categories': this.formBuilder.array([]),
    });
    const authorFormArray = this.createBookForm.get('authors') as FormArray;
    this.addNewAuthor();
    const categoryFormArray = this.createBookForm.get('categories') as FormArray;
    this.addNewCategory();
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

    this.adminService.createBook(formBookData).subscribe((data)=>{
      alert("Book Created Successfully!");
      this.router.navigate(['./admin/dashboard']);
    }, err => {
      alert("Sorry the book wasn`t created! Please try again")
    })
    console.log(formBookData);
  }
}
