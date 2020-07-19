import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent {
  public reviews: Review[];

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    http.get<Review[]>(baseUrl + 'review').subscribe(result => {
      this.reviews = result;
      console.error(this.reviews)
    }, error => console.error(error));
  }
}

interface Review {
  asin: string;
  date: string;
  title: string;
  content: string;
  ating: bigint;
}
