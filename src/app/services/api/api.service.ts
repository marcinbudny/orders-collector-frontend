import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../../model/order';
import { Observable } from 'rxjs';
import * as commands from 'src/app/model/commands';
import { delay } from 'rxjs/operators';
import { Local } from 'src/app/model/local';

const rootUrl = 'http://localhost:5000';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private client: HttpClient) {}

  orderItem(command: commands.OrderItemCommand): Observable<Object> {
    return this.client
      .post(`${rootUrl}/orders/order-item`, command)
      .pipe(delay(1000)); // TODO: remove
  }

  selectResponsiblePerson(
    command: commands.SelectResponsiblePerson
  ): Observable<Object> {
    return this.client
      .post(`${rootUrl}/orders/select-responsible-person`, command)
      .pipe(delay(1000)); // TODO: remove
  }

  getOrdersForToday(): Observable<Order[]> {
    return this.client.get<Order[]>(`${rootUrl}/orders/today`);
  }

  getLocals(): Observable<Local[]> {
    return this.client.get<Local[]>(`${rootUrl}/locals`);
  }
}
