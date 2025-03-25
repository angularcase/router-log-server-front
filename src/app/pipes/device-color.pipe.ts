import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deviceColor'
})
export class DeviceColorPipe implements PipeTransform {

  transform(value: string): string {
    if (value in MacOwnersColors) {
      // return MacOwnersColors[value as keyof typeof MacOwnersColors];
      return 'grey'
    } else {
      return 'black';
    }
  }

}

export enum MacOwnersColors {
  'b2:4b:4d:84:24:57' = 'rgba(0,143,251,0.85)',
  '70:32:17:91:b2:3e' = 'rgba(0,227,150,0.85)',
  '62:49:ef:39:b3:6d' = 'rgba(254,176,25,0.85)',
  '14:ac:60:df:13:63' = 'rgba(119,93,208,0.85)',
  '8e:3b:ae:57:0c:e4' = 'rgba(255,69,96,0.85)',
  '50:14:79:39:43:21' = 'rgba(255, 220, 184, 0.85)'
}
