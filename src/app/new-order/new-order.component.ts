import { Component, OnInit, OnDestroy } from '@angular/core';
import * as fromOrders from '../state/order.reducer';
import * as orderActions from '../state/order.actions';
import * as uuid from 'uuid';
import { Store, select } from '@ngrx/store';
import { takeWhile, startWith, map } from 'rxjs/operators';
import { Local } from '../model/local';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit, OnDestroy {
  isComponentActive = true;

  localSelect = new FormControl(
    { value: null, disabled: true },
    Validators.required
  );
  itemName = new FormControl(null, Validators.required);

  itemForm = new FormGroup({
    localSelect: this.localSelect,
    itemName: this.itemName
  });

  formVisible = false;
  isOrderingItem = false;
  personName: string | null;
  locals: Local[] | undefined;
  filteredLocals$: Observable<Local[]>;

  constructor(private store: Store<fromOrders.OrdersState>) {}

  ngOnInit() {
    this.store
      .pipe(
        select(fromOrders.getPersonName),
        takeWhile(_ => this.isComponentActive)
      )
      .subscribe(name => (this.personName = name));

    this.store
      .pipe(
        select(fromOrders.getOrderingItemForOrderId),
        takeWhile(_ => this.isComponentActive)
      )
      .subscribe(orderingMode => this.onOrderingForOrderId(orderingMode));

    this.store
      .pipe(
        select(fromOrders.commandInProgress),
        takeWhile(_ => this.isComponentActive)
      )
      .subscribe(
        cmd =>
          (this.isOrderingItem =
            cmd instanceof fromOrders.OrderItemCommandInProgress &&
            cmd.orderId === null)
      );

    this.store
      .pipe(
        select(fromOrders.getLocals),
        takeWhile(_ => this.isComponentActive)
      )
      .subscribe(locals => {
        this.locals = locals;
        if (locals && locals.length > 0) {
          this.localSelect.enable();
        }
      });

    const localNameValues$ = this.localSelect.valueChanges.pipe(
      startWith<string | Local>(''),
      map(value => {
        if (typeof value === 'string') {
          return value;
        }

        if (value) {
          return value.name;
        }

        return '';
      })
    );

    const locals$ = this.store.pipe(select(fromOrders.getLocals));

    this.filteredLocals$ = combineLatest(locals$, localNameValues$).pipe(
      map(([locals, localNameValue]) =>
        this.filterLocals(locals, localNameValue)
      )
    );
  }

  private filterLocals(locals: Local[], filter: string): Local[] {
    if (!locals) {
      return [];
    }

    return locals.filter(l =>
      l.name.toLowerCase().includes(filter.toLowerCase())
    );
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

  clear(): void {
    this.itemForm.reset();
  }

  onOrder(): void {
    // const personName = `Person${Math.floor(Math.random() * 10000)}`;
    if (this.personName) {
      this.store.dispatch(
        new orderActions.OrderNewItem({
          commandId: uuid.v4(),
          localId: this.itemForm.value.localSelect.id,
          itemName: this.itemForm.value.itemName,
          personName: this.personName
        })
      );
    }
  }

  onCancel(): void {
    this.store.dispatch(new orderActions.CancelOrderingItem());
  }

  onAddNewOrder() {
    this.store.dispatch(new orderActions.StartOrderingItem('new order'));
  }

  get localsAreLoaded() {
    return this.locals && this.locals.length > 0;
  }

  displayLocal(local?: Local): string | undefined {
    return local ? local.name : undefined;
  }
}
