import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondsToHoursMinutes'
})
export class SecondsToHoursMinutesPipe implements PipeTransform {
  transform(seconds: number | undefined, hoursLeadingZeros: number = 0): string {
    if (!seconds || seconds < 0) {
      return '0:00';
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    // Formatowanie godzin z wiodącymi zerami
    const formattedHours = hoursLeadingZeros > 0
      ? hours.toString().padStart(hoursLeadingZeros, '0')
      : hours.toString();

    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    return `${formattedHours}:${formattedMinutes}`;
  }
}
