import { Component, OnDestroy, OnInit, ViewChild, viewChild } from "@angular/core";
import { ArchiveSummaryResult, BackendService, Device } from "./services/backend.service";
import { DatePipe, NgClass } from "@angular/common";
import { DeviceNamePipe } from "./pipes/device-name.pipe";
import { WebsocketService } from "./services/websocket.service";
import { Subscription } from "rxjs";
import { TestGraphComponent } from "./shared/test-graph/test-graph.component";
import { DeviceColorPipe } from "./pipes/device-color.pipe";
import { SecondsToHoursMinutesPipe } from "./pipes/seconds-to-hours-minutes.pipe";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [NgClass, DatePipe, DeviceNamePipe, TestGraphComponent, SecondsToHoursMinutesPipe],
  standalone: true
})
export class AppComponent implements OnInit, OnDestroy {

  public loaded = true;

  public macsSummary: ArchiveSummaryResult[] = [];

  @ViewChild(TestGraphComponent) testGraph!: TestGraphComponent;

  numberOfClients = 0;

  devices: Device[] = [];

  onConnectedDeviceSub: Subscription | undefined;
  onNumberOfClientsSub: Subscription | undefined;

  constructor(
    private websocketService: WebsocketService,
    private backendService: BackendService
  ) { }

  ngOnInit(): void {

    const from: Date = new Date((new Date()).setHours(8, 0, 0, 0));
    const to: Date = new Date((new Date()).setHours(20, 0, 0, 0));

    this.backendService.getArchiveSummary({ from: from, to: to }).subscribe((macsSummary: ArchiveSummaryResult[]) => {
      this.macsSummary = macsSummary;
    });

    this.onConnectedDeviceSub = this.websocketService.onConnectedDevicesMessage().subscribe((devices) => {
      this.devices = devices;
    });

    this.onNumberOfClientsSub = this.websocketService.onNumberOfClientsMessage().subscribe((number) => {
      this.numberOfClients = number;
    });
  }

  getSummaryByMac(mac: string) {
    const macSummary = this.macsSummary.find(macSummary => macSummary.mac === mac);
    return macSummary ? macSummary.seconds : 0;
  }

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

}
