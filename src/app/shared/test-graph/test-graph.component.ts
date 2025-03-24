import { Component, OnInit } from '@angular/core';
import { BackendService, Device } from '../../services/backend.service';
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

  public chartOptions: {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    plotOptions: ApexPlotOptions;
    xaxis: ApexXAxis;
  };

  constructor(private backendService: BackendService) {
    const today = new Date();
    const startTime = new Date(today.setHours(8, 0, 0, 0));
    const endTime = new Date(today.setHours(20, 0, 0, 0));

    this.chartOptions = {
      series: [
        {
          name: "Device Activity",
          data: []
        }
      ],
      chart: {
        height: 350,
        type: "rangeBar"
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
        min: startTime.getTime(),
        max: endTime.getTime(),
        labels: {
          format: 'HH:mm'
        }
      }
    };
  }

  ngOnInit(): void {
    this.loadChartData();
  }

  private loadChartData(): void {
    this.backendService.getArchive().subscribe((devices: Device[]) => {
      const whiteMacs = Object.keys(MacOwners);
      const chartSeries: any[] = [];
    
      for (let whiteMac of whiteMacs) {
        const macName = (MacOwners as any)[whiteMac];
        const macDevices = devices
          .filter(device => device.mac === whiteMac)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
        const whiteMacSeries: any[] = [];
    
        let currentStart: Date | null = null;
    
        for (let record of macDevices) {
          const currentDate = new Date(record.date);
    
          if (record.state) {
            // start aktywności
            if (!currentStart) {
              currentStart = currentDate;
            }
          } else {
            // koniec aktywności
            if (currentStart) {
              whiteMacSeries.push({
                x: (MacOwners as any)[whiteMac],
                y: [currentStart.getTime(), currentDate.getTime()],
                // fillColor: "#008FFB", // możesz dać różne kolory np. na podstawie właściciela
              });
              currentStart = null;
            }
          }
        }
    
        // Jeśli ostatni status był `true` i nie było końca
        if (currentStart) {
          whiteMacSeries.push({
            x: (MacOwners as any)[whiteMac],
            y: [currentStart.getTime(), new Date().getTime()], // do teraz
            // fillColor: "#008FFB",
          });
        }
    
        chartSeries.push(...whiteMacSeries);
      }
  
      this.updateChart(chartSeries);

      console.log(chartSeries); // gotowe dane do wykresu
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