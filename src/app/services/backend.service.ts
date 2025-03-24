import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Device {
  mac: string;
  state: boolean;
  date: Date;
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

  getArchive(dto?: GetArchiveDto): Observable<Device[]> {
    const url = `${this.apiUrl}/get-archive`;
    let params = new HttpParams();
  
    if (dto?.from) {
      params = params.set('from', dto.from.toISOString());
    }
  
    if (dto?.to) {
      params = params.set('to', dto.to.toISOString());
    }
  
    return this.httpClient.get<Device[]>(url, { params });
  }
  
}

export interface GetArchiveDto {
  from?: Date;
  to?: Date;
}