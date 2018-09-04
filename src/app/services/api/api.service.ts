import { Injectable } from '@angular/core';
import { Order } from '../../read-model/order';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor() {}

  getOrdersForToday(): Observable<Order[]> {
    const orders: Order[] = [
      {
        id: 'masalahouse-20180904',
        localId: 'masalahouse',
        localName: 'Masla House',
        date: new Date('2018-09-04T19:00:00Z'),
        items: [
          {
            itemName: 'Tikka masala',
            personName: 'MarcinB'
          },
          {
            itemName: 'Vindaloo',
            personName: 'LukaszG'
          }
        ]
      },
      {
        id: 'synergia-20180904',
        localId: 'synergia',
        localName: 'Synergia',
        date: new Date('2018-09-04T18:30:00Z'),
        items: [
          {
            itemName: 'Risotto z kurkami',
            personName: 'PrzemekP'
          }
        ]
      }
    ];

    return of(orders);
  }
}
