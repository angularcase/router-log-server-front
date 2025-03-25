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

  public macsSummaryToday: ArchiveSummaryResult[] = [];

  public macsSummaryMonth: ArchiveSummaryResult[] = [];

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
    const fromToday: Date = new Date((new Date()).setHours(8, 0, 0, 0));
    const toToday: Date = new Date((new Date()).setHours(20, 0, 0, 0));
    
    this.backendService.getArchiveSummary({ from: fromToday, to: toToday }).subscribe((macsSummary: ArchiveSummaryResult[]) => {
      this.macsSummaryToday = macsSummary;
    });

    const now = new Date();
    const fromMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const toMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    this.backendService.getArchiveSummary({ from: fromMonth, to: toMonth }).subscribe((macsSummary: ArchiveSummaryResult[]) => {
      this.macsSummaryMonth = macsSummary;
    });

    this.onConnectedDeviceSub = this.websocketService.onConnectedDevicesMessage().subscribe((devices) => {
      this.devices = devices;
    });

    this.onNumberOfClientsSub = this.websocketService.onNumberOfClientsMessage().subscribe((number) => {
      this.numberOfClients = number;
    });
  }

  getLiveQuantity(): number {
    return this.devices.filter(device => device.state).length;
  }

  getSummaryTodayByMac(mac: string) {
    const macSummary = this.macsSummaryToday.find(macSummary => macSummary.mac === mac);
    return macSummary ? macSummary.seconds : 0;
  }

  getSummaryMonthByMac(mac: string) {
    const macSummary = this.macsSummaryMonth.find(macSummary => macSummary.mac === mac);
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
