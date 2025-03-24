import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'deviceName'
})
export class DeviceNamePipe implements PipeTransform {

  transform(value: string): string {
    if (value in MacOwners) {
      return MacOwners[value as keyof typeof MacOwners];
    } else {
      return 'Unknown mac owner';
    }
  }

}

export enum MacOwners {
  'b2:4b:4d:84:24:57' = 'Z',
  '70:32:17:91:b2:3e' = 'D',
  '62:49:ef:39:b3:6d' = 'T',
  '14:ac:60:df:13:63' = 'P',
  '8e:3b:ae:57:0c:e4' = 'G',
  '50:14:79:39:43:21' = 'i'
}