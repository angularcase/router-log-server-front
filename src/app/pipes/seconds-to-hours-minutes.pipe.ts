import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondsToHoursMinutes'
})
export class SecondsToHoursMinutesPipe implements PipeTransform {
  transform(seconds: number): string {
    if (!seconds || seconds < 0) {
      return '0:00';
    }
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    // Dodajemy wiodące zero do minut, jeśli jest ich mniej niż 10
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  }
}
