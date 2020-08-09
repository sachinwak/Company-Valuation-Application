import { Injectable } from '@angular/core';

import { HttpClient} from '@angular/common/http';

import { environment } from '../environments/environment';

import {map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {
  
  constructor(
    private http: HttpClient 
  ) { }

  public loadingSubject = new Subject();

  // Search Company
  searchCompany(term:string, exchange:string, limit:string) {
    let url = `${environment.apiUrl}search?query=${term}&limit=${limit}&exchange=${exchange}&apikey=${environment.apiKey}`;

    return this.http.get<[]>(url)
    .pipe(                
      map(res => {
          return res;    
      })
    );
  }

  // Get Company profile
  getProfile(exchangeSymbol:string){
    let url = `${environment.apiUrl}profile/${exchangeSymbol}?apikey=${environment.apiKey}`;
    return this.http.get<[]>(url)
    .pipe(                
      map(res => {
          return res;
      })
    );
  }

  // Get Company Rating
  getCompanyRating(exchangeSymbol:string){
    let url = `${environment.apiUrl}rating/${exchangeSymbol}?apikey=${environment.apiKey}`;
    return this.http.get<[]>(url)
    .pipe(                
      map(res => {
          return res;    
      })
    );
  }

  // Get downloadable link for income statement
  downloadIncomeStatement(exchangeSymbol:string) {

    let url = `${environment.apiUrl}income-statement/${exchangeSymbol}?datatype=csv&apikey=${environment.apiKey}`;

    return this.http.get(url, {responseType: 'blob'});
  }
}
