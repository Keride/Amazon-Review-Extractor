import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { FetchDataComponent, NgbdSortableHeader } from './fetch-data/fetch-data.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    FetchDataComponent,
    NgbdSortableHeader
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule, 
    RouterModule.forRoot([
      { path: '', component: FetchDataComponent, pathMatch: 'full'},
    ]), NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
