import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BackendService, ConnectedDevicesDto, Device } from './services/backend.service';
import { DatePipe, NgClass } from '@angular/common';

export enum Worker {
  Z = 'b2:4b:4d:84:24:57',
  D = '70:32:17:91:b2:3e',
  T = '62:49:ef:39:b3:6d',
  P = '14:ac:60:df:13:63',
  G = '8e:3b:ae:57:0c:e4',
  iRobot = '50:14:79:39:43:21'
}

export const workerStates: Record<Worker, boolean> = {
  [Worker.Z]: false,
  [Worker.D]: false,
  [Worker.T]: false,
  [Worker.P]: false,
  [Worker.G]: false,
  [Worker.iRobot]: false
};


@Component({
  selector: 'app-root',
  imports: [NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  public loaded = false;
  
  constructor(
    private backendService: BackendService
  ) {}

  public getWorkers() {
    return Object.values(Worker);
  }

  public isWorkerActive(worker: Worker) {
    return workerStates[worker];
  }

  ngOnInit(): void {
    this.load();
  }

  public load() {
    this.loaded = false;
    this.backendService.getConnectedDevices().subscribe((connectedDevices: Device[]) => {
      this.getWorkers().forEach(worker => {
        workerStates[worker] = false;
        connectedDevices.forEach(connectedDevices => {
          if (connectedDevices.mac == worker) {
            workerStates[worker] = true;
          }
        })
      });
      this.loaded = true;
    });
  }
}


