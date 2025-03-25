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

  // getDevicesState(): Observable<Device[]> {
  //   const url = `${this.apiUrl}/get-devices-state`;
  //   return this.httpClient.get<Device[]>(url);
  // }

  getArchiveSummary(dto: GetArchiveSummaryDto): Observable<ArchiveSummaryResult[]> {
    const url = `${this.apiUrl}/get-archive-summary`;
    let params = new HttpParams();

    params = params.set('from', dto.from.toISOString());
    params = params.set('to', dto.to.toISOString());

    return this.httpClient.get<ArchiveSummaryResult[]>(url, { params });
  }

  getArchive(dto: GetArchiveDto): Observable<ArchiveResult[]> {
    const url = `${this.apiUrl}/get-archive`;
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
  from: Date;
  to: Date;
}

export interface GetArchiveSummaryDto {
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

export interface ArchiveSummaryResult {
  mac: string;
  seconds: number;
}