import { Component, Inject, QueryList, EventEmitter, Directive, Output, Input, ViewChildren, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DecimalPipe } from '@angular/common';

export type SortColumn = keyof Review | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': '', '': 'asc' };

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})

export class NgbdSortableHeader {

  @Input() sortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortable, direction: this.direction });
  }
}

function search(text: string, reviews: Review[]): Review[] {
  return reviews.filter(review => {
    const term = text.toLowerCase();
    return review.title.toLowerCase().includes(term)
      || review.content.toLowerCase().includes(term)
      || review.asin.toLowerCase().includes(term);
  });
}
export class NgbdTableFiltering {


}

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})

export class FetchDataComponent {
  public reviews: Review[];
  public asins: string[];
  public reviews$: Observable<Review[]>;

  public asinForm = new FormGroup({
    ASIN: new FormControl('')
  });
  public filter = new FormControl('');

  private http: HttpClient;
  private baseUrl: string;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.baseUrl = baseUrl;
    this.http = http;
  }

  getReviewForASIN(asin: string) {
    this.asins.push(asin);

    this.http.get<Review[]>(this.baseUrl + 'review/' + asin).subscribe(result => {
      this.reviews.push.apply(result);

      this.reviews$ = this.filter.valueChanges.pipe(
        startWith(''),
        map(text => search(text, this.reviews))
      );

    }, error => console.error(error));
  }

  onSubmit() {
    this.getReviewForASIN(this.asinForm.value.ASIN)
  }

  onSort({ column, direction }: SortEvent) {
    
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // sorting countries
    this.reviews = this.reviews.sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

interface Review {
  asin: string;
  date: string;
  title: string;
  content: string;
  rating: bigint;
}