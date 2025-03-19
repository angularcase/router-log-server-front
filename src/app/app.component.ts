import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BackendService, LiveData, MacAddress } from './services/backend.service';

@Component({
  selector: 'app-root',
  imports: [],
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

  getPeople() {
    return Object.values(MacAddress);
  }

  getPersonByValue(addr: keyof MacAddress) {
    return MacAddress[addr];
  }

}


