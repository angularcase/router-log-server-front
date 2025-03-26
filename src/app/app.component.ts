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

  public macsSummaryToday: ArchiveSummaryResultWrapper[] = [];

  public macsSummaryMonth: ArchiveSummaryResultWrapper[] = [];

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
    const today = new Date();
    const fromToday = new Date(today.setHours(8, 0, 0, 0));
    const toToday = new Date((new Date()).setHours(10, 0, 0, 0));
  
    this.fetchAndWrapSummary(fromToday, toToday, (data: any) => {
      this.macsSummaryToday = data;
    });
  
    const now = new Date();
    const fromMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const toMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  
    this.fetchAndWrapSummary(fromMonth, toMonth, (data: any) => {
      this.macsSummaryMonth = data;
    }); 

    this.onConnectedDeviceSub = this.websocketService.onConnectedDevicesMessage().subscribe((devices) => {
      this.devices = devices;
    });

    this.onNumberOfClientsSub = this.websocketService.onNumberOfClientsMessage().subscribe((number) => {
      this.numberOfClients = number;
    });
  }

  private fetchAndWrapSummary(from: Date, to: Date, callback: (data: any) => void): void {
    this.backendService.getArchiveSummary({ from, to }).subscribe((macsSummary: ArchiveSummaryResult[]) => {
      const sorted = [...macsSummary].sort((a, b) => b.seconds - a.seconds);
  
      const wrappedSummary: ArchiveSummaryResultWrapper[] = sorted.map((item, index) => {
        const place = index + 1;
        let bgClass = 'text-bg-light';
  
        if (place === 1) bgClass = 'text-bg-warning';
        if (place === sorted.length) bgClass = 'text-bg-secondary';
  
        return {
          ...item,
          place,
          bgClass
        };
      });
  
      callback(wrappedSummary);
    });
  }

  getLiveQuantity(): number {
    return this.devices.filter(device => device.state).length;
  }

  getSummaryTodayByMac(mac: string) {
    const macSummary = this.macsSummaryToday.find(macSummary => macSummary.mac === mac);
    return macSummary;
  }

  getSummaryMonthByMac(mac: string) {
    const macSummary = this.macsSummaryMonth.find(macSummary => macSummary.mac === mac);
    return macSummary;
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

export interface ArchiveSummaryResultWrapper extends ArchiveSummaryResult {
  place: number;
  bgClass: string;
}