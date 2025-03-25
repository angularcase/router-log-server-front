import { Component, Input, OnInit } from '@angular/core';
import { ArchiveResult, BackendService, Device, GetArchiveDto } from '../../services/backend.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexXAxis,
  NgApexchartsModule
} from "ng-apexcharts";
import { DeviceNamePipe, MacOwners } from '../../pipes/device-name.pipe';

@Component({
  selector: 'app-test-graph',
  imports: [NgApexchartsModule],
  templateUrl: './test-graph.component.html',
  styleUrl: './test-graph.component.scss',
  providers: [DeviceNamePipe],
  standalone: true
})
export class TestGraphComponent implements OnInit {

  public dayFactor = 0;

  from: Date = new Date((new Date()).setHours(8, 0, 0, 0));
  to: Date = new Date((new Date()).setHours(18, 0, 0, 0));

  public chartOptions: {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    plotOptions: ApexPlotOptions;
    xaxis: ApexXAxis;
  };

  constructor(private backendService: BackendService,
    private deviceNamePipe: DeviceNamePipe
  ) {
    this.chartOptions = {
      series: [
        {
          name: "Device Activity",
          data: []
        }
      ],
      chart: {
        height: 350,
        type: "rangeBar",
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      
      },
      plotOptions: {
        bar: {
          horizontal: true,
          distributed: true,
          barHeight: '70%'
        }
      },
      xaxis: {
        type: "datetime",
        min: this.from.getTime(),
        max: this.to.getTime(),
        labels: {
          datetimeUTC: false,
          format: 'HH:mm'
        }
      }
    };
  }

  ngOnInit(): void {
    const from: Date = new Date((new Date()).setHours(8, 0, 0, 0));
    const to: Date = new Date((new Date()).setHours(20, 0, 0, 0));

    this.backendService.getArchiveNew({from: from, to: to}).subscribe((archiveResults: ArchiveResult[]) => {
      const chartSeries = this.parseChartData(archiveResults);
      this.updateChart(chartSeries);
    });
  }

  private parseChartData(archiveResults: ArchiveResult[]) {
    const chartSeries: any[] = [];

    for (let macArchive of archiveResults) {

      for (let range of macArchive.ranges) {
        chartSeries.push({
          x: this.deviceNamePipe.transform(macArchive.mac),
          y: [range.from.getTime(), range.to.getTime()]
        });
      }

    }

    return chartSeries;
  }

  private updateChart(seriesData: any[]): void {
    this.chartOptions = {
      ...this.chartOptions,
      series: [{
        name: "Device Activity",
        data: seriesData
      }]
    };
  }

  public getDayFactor() {
    return this.dayFactor;
  }

  public plusFactor() {
    this.dayFactor++;
  }

  public minusFactor() {
    this.dayFactor--;
  }
}