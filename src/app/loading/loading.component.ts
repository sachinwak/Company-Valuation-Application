import { Component, OnInit } from '@angular/core';
import { Api } from '../api.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  showLoading:boolean = false;

  constructor(private api: Api) {
  }

  ngOnInit() {
    this.api.loadingSubject.subscribe((data:boolean) =>{
      this.showLoading = data;
    });
  }
}
