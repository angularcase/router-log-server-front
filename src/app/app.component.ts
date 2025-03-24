import { Component, OnDestroy, OnInit, ViewChild, viewChild } from "@angular/core";
import { BackendService, Device } from "./services/backend.service";
import { DatePipe, NgClass } from "@angular/common";
import { DeviceNamePipe } from "./pipes/device-name.pipe";
import { WebsocketService } from "./services/websocket.service";
import { Subscription } from "rxjs";
import { TestGraphComponent } from "./shared/test-graph/test-graph.component";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [NgClass, DatePipe, DeviceNamePipe, TestGraphComponent],
  standalone: true
})
export class AppComponent implements OnInit, OnDestroy {

  public loaded = true;

  @ViewChild(TestGraphComponent) testGraph!: TestGraphComponent;

  numberOfClients = 0;

  devices: Device[] = [];

  onConnectedDeviceSub: Subscription | undefined;
  onNumberOfClientsSub: Subscription | undefined;

  constructor(
    private websocketService: WebsocketService
  ) {}

  ngOnDestroy(): void {
    this.onConnectedDeviceSub?.unsubscribe();
    this.onNumberOfClientsSub?.unsubscribe();
  }

  public getDayFactor() {
    this.testGraph?.getDayFactor();
  }

  public plusFactor() {
    this.testGraph?.plusFactor();
  }

  public minusFactor() {
    this.testGraph?.minusFactor();
  }

  ngOnInit(): void {
    this.onConnectedDeviceSub = this.websocketService.onConnectedDevicesMessage().subscribe((devices) => {
      this.devices = devices;
    });

    this.onNumberOfClientsSub = this.websocketService.onNumberOfClientsMessage().subscribe((number) => {
      this.numberOfClients = number;
    });
  }
}
