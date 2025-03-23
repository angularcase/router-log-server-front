import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private apiUrl = environment.apiUrl;

  private socket = io(this.apiUrl);

  constructor() { }

  onConnectedDevicesMessage(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(MessageId.ConnectedDevices, (data) => {
        console.log(MessageId.ConnectedDevices, data);
        observer.next(data);
      });
    });
  }

}

export enum MessageId {
  ConnectedDevices = 'connected-devices'
}
