import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as fromOrders from '../../state/order.reducer';
import * as orderActions from '../../state/order.actions';
import { Store } from '@ngrx/store';
import { Event } from '../../model/events';

@Injectable({
  providedIn: 'root'
})
export class EventToActionMapperService {
  constructor(private store: Store<fromOrders.OrdersState>) {}

  mapEventsFrom(eventStream: Observable<Event>): void {
    eventStream.subscribe(event => this.publishActionFor(event));
  }

  private publishActionFor(event: Event): void {
    switch (event.type) {
      case 'NewOrderStarted':
        this.store.dispatch(
          new orderActions.OnEventNewOrderAdded(
            event.data.orderId,
            new Date(event.data.date),
            event.data.localId
          )
        );
        break;

      case 'OrderItemAdded':
        this.store.dispatch(
          new orderActions.OnEventOrderItemAdded(
            event.data.orderId,
            event.data.itemName,
            event.data.personName
          )
        );
        break;

      case 'OrderItemRemoved':
        this.store.dispatch(
          new orderActions.OnEventOrderItemRemoved(
            event.data.orderId,
            event.data.itemName,
            event.data.personName
          )
        );
        break;

      case 'OrderResponsiblePersonSelected':
        this.store.dispatch(
          new orderActions.OnEventResponsiblePersonSelected(
            event.data.orderId,
            event.data.personName
          )
        );
        break;

      case 'OrderResponsiblePersonRemoved':
        this.store.dispatch(
          new orderActions.OnEventResponsiblePersonRemoved(event.data.orderId)
        );
        break;

      case 'LocalAdded':
        this.store.dispatch(
          new orderActions.OnEventLocalAdded(event.data.id, event.data.name)
        );
        break;

      case 'LocalRenamed':
        this.store.dispatch(
          new orderActions.OnEventLocalRenamed(
            event.data.id,
            event.data.newName
          )
        );
        break;

      case 'LocalRemoved':
        this.store.dispatch(
          new orderActions.OnEventLocalRemoved(event.data.id)
        );
        break;

      case 'LocalAliasAdded':
        this.store.dispatch(
          new orderActions.OnEventLocalAliasAdded(
            event.data.localId,
            event.data.alias
          )
        );
        break;

      case 'LocalAliasRemoved':
        this.store.dispatch(
          new orderActions.OnEventLocalAliasRemoved(
            event.data.localId,
            event.data.alias
          )
        );
        break;

      default:
        console.warn(`Unknown event type ${event.type}`);
    }
  }
}
