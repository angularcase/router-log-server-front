import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private apiUrl = environment.apiUrl;

  constructor(
    private httpClient: HttpClient
  ) { }

  getLiveData() {
    return this.httpClient.get<LiveData>(`${this.apiUrl}/live-data`);
  }
}

export type Person = 'Z' | 'D' | 'T' | 'P' | 'G';

export type LiveData = {
  [key in Person]: 'in' | 'out';
};
