import { Component, OnDestroy, OnInit } from "@angular/core";
import { BackendService, Device } from "./services/backend.service";
import { DatePipe, NgClass } from "@angular/common";
import { DeviceNamePipe } from "./pipes/device-name.pipe";
import { WebsocketService } from "./services/websocket.service";
import { Subscription } from "rxjs";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [NgClass, DatePipe, DeviceNamePipe],
  standalone: true
})
export class AppComponent implements OnInit, OnDestroy {
  public loaded = true;

  devices: Device[] = [];

  subs: Subscription | undefined;

  constructor(
    private backendService: BackendService,
    private websocketService: WebsocketService
  ) {}

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  ngOnInit(): void {
    this.subs = this.websocketService.onConnectedDevicesMessage().subscribe((devices) => {
      this.devices = devices;
    });
  }
}
