import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../services/api/api.service';
import { Order } from '../model/order';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';

import * as orderActions from '../state/order.actions';
import * as fromOrders from '../state/order.reducer';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit, OnDestroy {
  orders: Order[];
  componentActive = true;

  constructor(
    private api: ApiService,
    private store: Store<fromOrders.OrdersState>
  ) {}

  ngOnInit() {
    this.store
      .pipe(
        select(fromOrders.getOrders),
        takeWhile(() => this.componentActive)
      )
      .subscribe(orders => (this.orders = orders));

    this.store.dispatch(new orderActions.LoadLocals());

    this.store.dispatch(new orderActions.LoadOrders());
  }

  getOrders(): void {
    this.api.getOrdersForToday().subscribe(orders => (this.orders = orders));
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}
