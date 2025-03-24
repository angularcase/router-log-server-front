import { Component, OnInit } from '@angular/core';
import { BackendService, Device, GetArchiveDto } from '../../services/backend.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexXAxis,
  NgApexchartsModule
} from "ng-apexcharts";
import { MacOwners } from '../../pipes/device-name.pipe';

@Component({
  selector: 'app-test-graph',
  imports: [NgApexchartsModule],
  templateUrl: './test-graph.component.html',
  styleUrl: './test-graph.component.scss',
  standalone: true
})
export class TestGraphComponent implements OnInit {

  from: Date = new Date((new Date()).setHours(8, 0, 0, 0));
  to: Date = new Date((new Date()).setHours(18, 0, 0, 0));

  public chartOptions: {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    plotOptions: ApexPlotOptions;
    xaxis: ApexXAxis;
  };

  constructor(private backendService: BackendService) {
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
          show: false // 👈 ukrywa pasek narzędzi (zoom, reset itd.)
        },
        zoom: {
          enabled: false // 👈 blokuje zoom przez zaznaczenie
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
    this.loadChartData();
  }

  private loadChartData(): void {
    const getArchiveDto: GetArchiveDto = {
      from: this.from,
      to: this.to,
    }

    this.backendService.getArchive(getArchiveDto).subscribe((devices: Device[]) => {
      const whiteMacs = Object.keys(MacOwners);
      const chartSeries: any[] = [];
    
      for (let whiteMac of whiteMacs) {
        let macDevices = devices
          .filter(device => device.mac === whiteMac);

        console.log(macDevices);

        macDevices = macDevices
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
        const whiteMacSeries: any[] = [];
    
        let currentStart: Date | null = null;
    
        for (let record of macDevices) {
          const currentDate = new Date(record.date);
        
          if (record.state) {
            // Początek aktywności tylko jeśli nie ma aktualnie otwartego przedziału
            if (!currentStart) {
              currentStart = currentDate;
            }
          } else {
            // Koniec aktywności tylko jeśli mamy rozpoczęty przedział
            if (currentStart) {
              whiteMacSeries.push({
                x: (MacOwners as any)[whiteMac],
                y: [currentStart.getTime(), currentDate.getTime()]
              });
              currentStart = null;
            }
          }
        }
        
    
        // Jeśli ostatni status był `true` i nie było końca
        if (currentStart && macDevices[macDevices.length - 1].state) {
          whiteMacSeries.push({
            x: (MacOwners as any)[whiteMac],
            y: [currentStart.getTime(), new Date().getTime()]
          });
        }
    
        chartSeries.push(...whiteMacSeries);
      }
  
      this.updateChart(chartSeries);
    });
  
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
}