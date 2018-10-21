import { ApiService } from '../services/api/api.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError } from 'rxjs/operators';
import * as orderActions from './order.actions';
import { Order } from '../model/order';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Local } from '../model/local';

@Injectable()
export class OrderEffects {
  constructor(private actions$: Actions, private api: ApiService) {}

  @Effect()
  loadTodaysOrders$ = this.actions$.pipe(
    ofType(orderActions.ActionTypes.LoadOrders),
    mergeMap((_: orderActions.LoadOrders) =>
      this.api.getOrdersForToday().pipe(
        map((orders: Order[]) => new orderActions.LoadOrdersSuccess(orders)),
        catchError(err => of(new orderActions.LoadOrdersFailed(err)))
      )
    )
  );

  @Effect()
  loadLocals$ = this.actions$.pipe(
    ofType(orderActions.ActionTypes.LoadLocals),
    mergeMap((_: orderActions.LoadLocals) =>
      this.api.getLocals().pipe(
        map((locals: Local[]) => new orderActions.LoadLocalsSuccess(locals)),
        catchError(err => of(new orderActions.LoadLocalsFailed(err)))
      )
    )
  );

  @Effect()
  orderItem$ = this.actions$.pipe(
    ofType(orderActions.ActionTypes.OrderNewItem),
    mergeMap((action: orderActions.OrderNewItem) =>
      this.api.orderItem(action.command).pipe(
        map(_ => new orderActions.OrderNewItemSuccess()),
        catchError(err => of(new orderActions.OrderNewItemFailed(err)))
      )
    )
  );
}
