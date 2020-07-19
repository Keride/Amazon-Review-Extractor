import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})

export class FetchDataComponent {
  public reviews: Review[];

  asinForm = new FormGroup({
    ASIN: new FormControl('')
  });
  
  private http:HttpClient;
  private baseUrl:string;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.baseUrl = baseUrl;
    this.http = http;

    this.getReviewForASIN("test");

  }

  getReviewForASIN(asin:string){
    this.http.get<Review[]>(this.baseUrl + 'review/' + asin).subscribe(result => {
      this.reviews = result;
    }, error => console.error(error));
  }

  onSubmit() {
    console.log(this.asinForm.value)
    console.log(this.asinForm.value.asin)
    this.getReviewForASIN(this.asinForm.value.ASIN)
  }
}

interface Review {
  asin: string;
  date: string;
  title: string;
  content: string;
  rating: bigint;
}
