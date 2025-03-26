import { Component, Input, OnInit } from '@angular/core';
import { ArchiveResult, BackendService, Device, GetArchiveDto } from '../../services/backend.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexXAxis,
  NgApexchartsModule
} from "ng-apexcharts";
import { DeviceNamePipe, MacOwnersNames } from '../../pipes/device-name.pipe';
import { DeviceColorPipe } from '../../pipes/device-color.pipe';

@Component({
  selector: 'app-test-graph',
  imports: [NgApexchartsModule],
  templateUrl: './test-graph.component.html',
  styleUrl: './test-graph.component.scss',
  providers: [DeviceNamePipe, DeviceColorPipe],
  standalone: true
})
export class TestGraphComponent implements OnInit {

  public dayFactor = 0;

  from: Date = new Date((new Date()).setHours(7, 0, 0, 0));
  to: Date = new Date((new Date()).setHours(20, 0, 0, 0));

  public chartOptions: {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    plotOptions: ApexPlotOptions;
    xaxis: ApexXAxis;
  };

  constructor(
    private backendService: BackendService,
    private deviceNamePipe: DeviceNamePipe,
    private deviceColorPipe: DeviceColorPipe
  ) {
    this.chartOptions = {
      series: [
        {
          name: "Device Activity",
          data: []
        }
      ],
      chart: {
        height: 200,
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
          // distributed: true,
          barHeight: '40%'
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
    this.backendService.getArchive({from: this.from, to: this.to}).subscribe((archiveResults: ArchiveResult[]) => {
      console.log(archiveResults);
      const chartSeries = this.toChartData(archiveResults);
      this.updateChart(chartSeries);
    });
  }

  private toChartData(archiveResults: ArchiveResult[]) {
    const chartSeries: any[] = [];

    for (let macArchive of archiveResults) {

      for (let range of macArchive.ranges) {
        chartSeries.push({
          x: this.deviceNamePipe.transform(macArchive.mac),
          y: [range.from.getTime(), range.to.getTime()],
          fillColor: this.deviceColorPipe.transform(macArchive.mac)
        });
      }

    }

    return chartSeries;
  }

  public isDataEmpty() {
    return this.chartOptions.series[0].data.length === 0;
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