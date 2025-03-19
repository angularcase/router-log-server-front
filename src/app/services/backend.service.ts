import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private apiUrl = "http://localhost:3535";

  constructor(
    private httpClient: HttpClient
  ) { }

  getLiveData() {
    return this.httpClient.get<LiveData>(`${this.apiUrl}/live-data`);
  }
}

export interface LiveData {
  [addr: string]: 'in' | 'out';
}

export enum MacAddress {
  Z = 'b2:4b:4d:84:24:57',
  D = '70:32:17:91:b2:3e',
  T = '62:49:ef:39:b3:6d',
  P = '14:ac:60:df:13:63',
  G = '8e:3b:ae:57:0c:e4',
}
