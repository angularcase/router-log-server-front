import { Component, OnInit } from "@angular/core";
import { BackendService, Device } from "./services/backend.service";
import { NgClass } from "@angular/common";

export enum Worker {
  Z, 
  D, 
  T, 
  P, 
  G, 
  iRobot
}

export const workerMac: Record<Worker, string> = {
  [Worker.Z]: 'b2:4b:4d:84:24:57',
  [Worker.D]: '70:32:17:91:b2:3e',
  [Worker.T]: '62:49:ef:39:b3:6d',
  [Worker.P]: '14:ac:60:df:13:63',
  [Worker.G]: '8e:3b:ae:57:0c:e4',
  [Worker.iRobot]: '50:14:79:39:43:21'
}

export const workerState: Record<Worker, boolean> = {
  [Worker.Z]: false,
  [Worker.D]: false,
  [Worker.T]: false,
  [Worker.P]: false,
  [Worker.G]: false,
  [Worker.iRobot]: false
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [NgClass],
})
export class AppComponent implements OnInit {
  public loaded = false;
  public Worker = Worker;

  constructor(private backendService: BackendService) {}

  // Return only the numeric values (the actual enum values) rather than string names
  public getWorkers(): Worker[] {
    return Object.values(Worker).filter(value => typeof value === 'number') as Worker[];
  }

  public isWorkerActive(worker: Worker): boolean {
    return workerState[worker];
  }

  ngOnInit(): void {
    this.load();
  }

  public load(): void {
    this.loaded = false;
    this.backendService.getConnectedDevices().subscribe((connectedDevices: Device[]) => {
      this.getWorkers().forEach((worker: Worker) => {
        const macToCheck = workerMac[worker].toLowerCase();
        // Check if any device from the backend matches the worker’s MAC
        workerState[worker] = connectedDevices.some(
          (device) => device.mac.toLowerCase() === macToCheck
        );
      });
      this.loaded = true;
    });
  }
}
