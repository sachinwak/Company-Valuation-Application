import { Api } from './api.service';
import { Component } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private api : Api,
    private searchBuilder: FormBuilder,
     ){
      
  }

  currency = "";

  // Get all Exchange Data
  exchanges =["ETF" , "MUTUAL_FUND" , "COMMODITY" , "INDEX" , "CRYPTO" , "FOREX" , "TSX" , "AMEX" , "NASDAQ" , "NYSE" , "EURONEXT" ];

  // Set Limit Data
  limitData = [10,20,30];

  // Search Result
  searchResult = [];

  //saerch is empty
  isSearchResultEmpty : boolean = false;

  // company details
  companyProfileResult = [];
  companyRatingResult = [];
  /* ratingStarArray = Array */

  // Get search form details
  get getformData() { return this.searchForm.controls; }

  searchForm = this.searchBuilder.group({
    searchTerm : ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)
    ]],
    exchange : ['', [
      Validators.required
    ]],
    limit : ['', [
      Validators.required
    ]]
    }
  );

  title = 'company-valuation-application';
  
  onSearch(){
    this.api.loadingSubject.next(true);
    this.api.searchCompany(
        this.getformData.searchTerm.value, 
        this.getformData.exchange.value,
        this.getformData.limit.value).subscribe(
        data => {

          //check data if empty or not
          if(data.length == 0){
            this.isSearchResultEmpty = true;
          }else{
            this.isSearchResultEmpty = false;
          }
          this.searchResult = data;

          // if length is single then search for company details
          if(this.searchResult.length == 1)
          { 
            this.onSymbolClick(this.searchResult[0].symbol, this.searchResult[0].currency);
          }else{
            this.api.loadingSubject.next(false);
          }
        },
        error => {
          console.log(error.message);       
          this.api.loadingSubject.next(false);   
        }
    );
  }

  onGettingCompanyProfile(excahngeSymbol:string){
    this.api.loadingSubject.next(true);
    this.api.getProfile(excahngeSymbol).subscribe(
        data => {
          console.log(data  );
          this.companyProfileResult = data;

          //scroll to bottom
          window.scrollTo(0,document.body.scrollHeight);

          this.api.loadingSubject.next(false);
        },
        error => {
          console.log(error.message);
          this.api.loadingSubject.next(false);
        }
    );
  }

  getCompanyRating(excahngeSymbol:string){
    
    this.api.getCompanyRating(excahngeSymbol).subscribe(
      data => {
        console.log(data  );
        this.companyRatingResult = data;

        this.companyRatingResult[0].ratingScore
      },
      error => {
        console.log(error.message);
      }
  );
  }

  numSequence(n: number): Array<number> { 
    return Array(n); 
  } 

  onSymbolClick(exchangeSymbol:string, currencySymbol:string){
    this.getCompanyRating(exchangeSymbol);
    this.onGettingCompanyProfile(exchangeSymbol);
    this.currency = currencySymbol;
  }

  onSelectLimit(){
    console.log(this.getformData.limit.value);
  }

  onSelectExchange(){
    console.log(this.getformData.exchange.value);
  }

  downloadStatement(exchangeSymbol:string){
    this.api.downloadIncomeStatement(exchangeSymbol).subscribe(response => {
			let blob:any = new Blob([response], { type:  "application/octet-stream" });
      const url = window.URL.createObjectURL(blob);
      if(response.type == "application/json"){
        alert('Error downloading the file, API is not supported for this type of Symbol')
      }else{
        var link = document.createElement('a');
        link.href = url;
        link.download = exchangeSymbol + ".csv";
        link.click();
      }
		}), error => alert('Error downloading the file'),
      () => console.info('File downloaded successfully');
  }
}
