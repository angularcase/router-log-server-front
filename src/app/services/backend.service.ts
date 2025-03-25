import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';

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

  getArchiveNew(dto: GetArchiveNewDto): Observable<ArchiveResult[]> {
    const url = `${this.apiUrl}/get-archive-new`;
    let params = new HttpParams();

    params = params.set('from', dto.from.toISOString());
    params = params.set('to', dto.to.toISOString());

    return this.httpClient.get<ArchiveResult[]>(url, { params }).pipe(
      map(results =>
        results.map(result => ({
          ...result,
          ranges: result.ranges.map(range => ({
            from: new Date(range.from),
            to: new Date(range.to),
          })),
        }))
      )
    );
  }
  
}

export interface Device {
  mac: string;
  state: boolean;
  date: Date;
}

export interface GetArchiveDto {
  from?: Date;
  to?: Date;
}

export interface GetArchiveNewDto {
  from: Date;
  to: Date;
}

export interface ArchiveRange {
  from: Date;
  to: Date;
}

export interface ArchiveResult {
  mac: string;
  ranges: ArchiveRange[];
}