import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Order } from '../model/order';
import * as fromOrders from '../state/order.reducer';
import * as ordersActions from '../state/order.actions';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';
import { Local } from '../model/local';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, OnDestroy {
  @Input()
  order: Order;

  locals: Local[];

  formVisible = false;
  isOrderingItem = false;
  componentActive = true;

  itemName: string;

  constructor(private store: Store<fromOrders.OrdersState>) {}

  ngOnInit() {
    this.store
      .pipe(
        select(fromOrders.getOrderingItemForOrderId),
        takeWhile(() => this.componentActive)
      )
      .subscribe(orderingMode => this.showHideItemOrdering(orderingMode));

    this.store
      .pipe(
        select(fromOrders.getLocals),
        takeWhile(() => this.componentActive)
      )
      .subscribe(locals => (this.locals = locals));

    this.store
      .pipe(
        select(fromOrders.isProcessingCommand),
        takeWhile(() => this.componentActive)
      )
      .subscribe(isOrdering => (this.isOrderingItem = isOrdering));
  }

  ngOnDestroy() {}

  showHideItemOrdering(orderingMode: fromOrders.OrderingMode): void {
    if (
      orderingMode instanceof fromOrders.NewItemInOrder &&
      orderingMode.orderId === this.order.id
    ) {
      this.formVisible = true;
    } else {
      this.formVisible = false;
    }
  }

  selectResponsiblePerson(): void {
    this.order.responsiblePerson = 'MarcinB';
  }

  get localName(): string | null {
    if (this.locals && this.order) {
      const local = this.locals.find(l => l.id === this.order.localId);
      if (local) {
        return local.name;
      }
    }

    if (this.order) {
      return this.order.localId;
    }

    return null;
  }

  onOrder(): void {
    const personName = `Person${Math.floor(Math.random() * 10000)}`;
    this.store.dispatch(
      new ordersActions.OrderNewItem({
        personName: personName,
        itemName: this.itemName,
        localId: this.order.localId
      })
    );
  }

  onCancel(): void {
    this.store.dispatch(new ordersActions.CancelOrderingItem());
  }

  onStartOrdering(): void {
    this.store.dispatch(
      new ordersActions.StartOrderingItem(
        new fromOrders.NewItemInOrder(this.order.id)
      )
    );
  }
}
