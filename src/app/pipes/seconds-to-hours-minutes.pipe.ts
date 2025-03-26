import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondsToHoursMinutes'
})
export class SecondsToHoursMinutesPipe implements PipeTransform {
  transform(seconds: number | undefined, hoursLeadingZeros: number = 0): string {
    if (seconds === undefined || seconds < 0) {
      const formattedHours = hoursLeadingZeros > 0 
        ? '0'.padStart(hoursLeadingZeros, '0')
        : '0';
      return `${formattedHours}:00`;
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const formattedHours = hoursLeadingZeros > 0
      ? hours.toString().padStart(hoursLeadingZeros, '0')
      : hours.toString();

    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes.toString();

    return `${formattedHours}:${formattedMinutes}`;
  }
}