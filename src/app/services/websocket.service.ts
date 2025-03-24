import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private apiUrl = environment.apiUrl;

  private socket = io(this.apiUrl, {
    transports: ['websocket']
  });

  constructor() { }

  onConnectedDevicesMessage(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(MessageId.ConnectedDevices, (data: any) => {
        observer.next(data);
      });
    });
  }

  onNumberOfClientsMessage(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(MessageId.NumberOfClients, (data: any) => {
        observer.next(data);
      });
    });
  }

}

export enum MessageId {
  ConnectedDevices = 'connected-devices',
  NumberOfClients = 'number-of-clients'
}