import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';

export interface Device {
  mac: string;
  state: boolean;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private apiUrl = environment.apiUrl;

  constructor(
    private httpClient: HttpClient
  ) { }

  getConnectedDevices(): Observable<Device[]> {
    const url = `${this.apiUrl}/get-connected-devices`;
    return this.httpClient.get<Device[]>(url);
  }

  getArchive(): Observable<Device[]> {
    const url = `${this.apiUrl}/get-archive`;
    return this.httpClient.get<Device[]>(url);
  }
}
