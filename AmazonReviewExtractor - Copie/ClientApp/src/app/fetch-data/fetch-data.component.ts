import { Component, Inject, QueryList, EventEmitter, Directive, Output, Input, ViewChildren, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})

export class FetchDataComponent {
  public reviews: Review[];
  public asins: Object;
  public reviews$: Observable<Review[]>;

  public asinForm = new FormGroup({
    ASIN: new FormControl('')
  });
  public filter = new FormControl('');

  private http: HttpClient;
  private baseUrl: string;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  private currentSort:SortEvent;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.baseUrl = baseUrl;
    this.http = http;
    this.asins = new Object()
    this.reviews = new Array()
  }

  get AsinStatus() { return AsinStatus; }

  getReviewForASIN(asin: string) {
    if(asin in this.asins)
      return;

    this.asins[asin] = AsinStatus.SEARCH;

    this.http.get<Review[]>(this.baseUrl + 'review/' + asin).subscribe(result => {
      if(result.length == 0 ){
        this.asins[asin] = AsinStatus.FAIL;
        return;
      }
      this.asins[asin] = AsinStatus.INDEX;
      this.reviews.push.apply(this.reviews, result);

      this.reviews$ = this.filter.valueChanges.pipe(
        startWith(''),
        map(text => search(text, this.reviews)),
        map(data => data.sort((a, b) => {
          if(!this.currentSort)
            return 0;
          const res = compare(a[this.currentSort.column], b[this.currentSort.column]);
          return this.currentSort.direction === 'asc' ? res : -res;
        }))
      );

    }, error => console.error(error));
  }

  onSubmit() {
    var asins = this.asinForm.value.ASIN.split(" ")
    for(var i in asins){
      this.getReviewForASIN(asins[i])
    }
  }

  onSort({ column, direction }: SortEvent) {
    this.currentSort = { column, direction };

    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.reviews$ = this.reviews$.pipe(
      startWith(''),
      map(text => search(this.filter.value, this.reviews)),
      map(data => data.sort((a, b) => {
        if(!this.currentSort)
          return 0;
        const res = compare(a[this.currentSort.column], b[this.currentSort.column]);
        return this.currentSort.direction === 'asc' ? res : -res;
      }))
    );

  }
}

interface Review {
  asin: string;
  date: string;
  title: string;
  content: string;
  rating: bigint;
}

export enum AsinStatus
{
  FAIL,
  INDEX,
  SEARCH
}