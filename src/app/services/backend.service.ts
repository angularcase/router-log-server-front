import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';

export interface Device {
  mac: string;
  localIp: string;
  hostname: string;
  publicIp: string;
  isOnline: boolean;
}

export type DeviceDataDto = [
  mac: string,
  localIp: string,
  hostname: string,
  publicIp: string,
  isOnline: boolean
];

export type ConnectedDevicesDto = Record<string, DeviceDataDto>;

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private apiUrl = environment.apiUrl;

  constructor(
    private httpClient: HttpClient
  ) { }

  getConnectedDevices(): Observable<Device[]> {
    const url = `${this.apiUrl}/router/get-connected-devices`;
    return this.httpClient.get<ConnectedDevicesDto>(url).pipe(
      map((rawDevices) =>
        Object.values(rawDevices).map(
          ([mac, localIp, hostname, publicIp, isOnline]) => ({
            mac,
            localIp,
            hostname,
            publicIp,
            isOnline,
          })
        )
      )
    );
  }  
}
