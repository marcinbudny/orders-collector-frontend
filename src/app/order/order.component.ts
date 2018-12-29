import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Order, OrderItem } from '../model/order';
import * as fromOrders from '../state/order.reducer';
import * as ordersActions from '../state/order.actions';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';
import { Local } from '../model/local';
import { FormControl, Validators } from '@angular/forms';

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
  isSelectingResponsiblePerson = false;
  isRemovingItem = false;
  personName: string | null;
  componentActive = true;

  itemName = new FormControl(null, Validators.required);

  constructor(private store: Store<fromOrders.OrdersState>) {}

  ngOnInit() {
    this.store
      .pipe(
        select(fromOrders.getPersonName),
        takeWhile(_ => this.componentActive)
      )
      .subscribe(name => (this.personName = name));

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
        select(fromOrders.commandInProgress),
        takeWhile(() => this.componentActive)
      )
      .subscribe(cmd => {
        this.isOrderingItem =
          cmd instanceof fromOrders.OrderItemCommandInProgress &&
          cmd.orderId === this.order.id;
        this.isSelectingResponsiblePerson =
          cmd instanceof fromOrders.SelectResponsiblePersonCommandInProgress &&
          cmd.orderId === this.order.id;
        this.isRemovingItem =
          cmd instanceof fromOrders.RemoveItemCommandInProgress &&
          cmd.orderId === this.order.id &&
          (this.personName !== null && cmd.personName === this.personName);
      });
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
    this.store.dispatch(
      new ordersActions.SelectResponsiblePerson({ orderId: this.order.id })
    );
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
    if (this.itemName.valid && this.personName) {
      // const personName = `Person${Math.floor(Math.random() * 10000)}`;
      this.store.dispatch(
        new ordersActions.OrderNewItem({
          personName: this.personName,
          itemName: this.itemName.value,
          localId: this.order.localId
        })
      );
    }
  }

  onCancel(): void {
    this.itemName.reset();
    this.store.dispatch(new ordersActions.CancelOrderingItem());
  }

  onStartOrdering(): void {
    this.store.dispatch(
      new ordersActions.StartOrderingItem(
        new fromOrders.NewItemInOrder(this.order.id)
      )
    );
  }

  onRemoveItem(item: OrderItem): void {
    this.store.dispatch(
      new ordersActions.RemoveItem({
        orderId: this.order.id,
        personName: item.personName
      })
    );
  }

  get currentPersonAlreadyOrdered() {
    return this.order.items.some(i => i.personName === this.personName);
  }
}
