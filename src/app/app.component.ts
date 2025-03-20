import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BackendService, LiveData, Person } from './services/backend.service';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [NgClass, DatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  liveData!: LiveData;
  
  constructor(
    private backendService: BackendService
  ) {}

  ngOnInit(): void {
    this.backendService.getLiveData().subscribe(liveData => {
      this.liveData = liveData;
    });
  }
  
  getPeople(): Person[] {
    return this.liveData ? Object.keys(this.liveData) as Person[] : [];
  }

}


