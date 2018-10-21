import { Component, OnInit, OnDestroy } from '@angular/core';
import * as fromOrders from '../state/order.reducer';
import * as orderActions from '../state/order.actions';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';
import { OrderItemCommand } from '../model/commands';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit, OnDestroy {
  isComponentActive = true;

  public formVisible = false;
  public localId: string;
  public itemName: string;
  public isOrderingItem = false;

  constructor(private store: Store<fromOrders.OrdersState>) {}

  ngOnInit() {
    this.store
      .pipe(
        select(fromOrders.getOrderingItemForOrderId),
        takeWhile(_ => this.isComponentActive)
      )
      .subscribe(orderingMode => this.onOrderingForOrderId(orderingMode));

    this.store
      .pipe(
        select(fromOrders.isProcessingCommand),
        takeWhile(_ => this.isComponentActive)
      )
      .subscribe(isOrderingItem => (this.isOrderingItem = isOrderingItem));
  }

  ngOnDestroy() {
    this.isComponentActive = false;
  }

  onOrderingForOrderId(orderingMode: fromOrders.OrderingMode): void {
    this.formVisible = orderingMode === 'new order';
    if (!this.formVisible) {
      this.clear();
    }
  }

  clear(): void {}

  onOrder(): void {
    const personName = `Person${Math.floor(Math.random() * 10000)}`;
    this.store.dispatch(
      new orderActions.OrderNewItem({
        localId: this.localId,
        itemName: this.itemName,
        personName: personName
      })
    );
  }

  onCancel(): void {
    this.store.dispatch(new orderActions.CancelOrderingItem());
  }

  onAddNewOrder() {
    this.store.dispatch(new orderActions.StartOrderingItem('new order'));
  }
}
