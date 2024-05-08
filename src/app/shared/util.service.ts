import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  mysqlDatetimeParser(dateString: string): Date {
    return new Date(dateString.replace(' ', 'T'))
  }

  mysqlDatetimeTransformer(date: Date): string {
    return date.toISOString().slice(0, 19).replace('T', ' ')
  }

  getTimeStringAsUTC(d: Date | string): string {
    if (typeof d === 'string') {
      return d;
    }
    const fake_d = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    return fake_d.toISOString();
  }

}
