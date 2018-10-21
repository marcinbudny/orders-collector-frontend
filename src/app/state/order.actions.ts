import { Action } from '@ngrx/store';
import { Order } from '../model/order';
import { OrderItemCommand } from '../model/commands';
import { OrderingMode } from './order.reducer';
import { Local } from '../model/local';

export enum ActionTypes {
  LoadOrders = '[Orders] Load orders',
  LoadOrdersSuccess = '[Orders] Load orders success',
  LoadOrdersFailed = '[Orders] Load orders failed',

  LoadLocals = '[Orders] Load locals',
  LoadLocalsSuccess = '[Orders] Load locals success',
  LoadLocalsFailed = '[Orders] Load locals failed',

  StartOrderingItem = '[Orders] Start ordering item',
  CancelOrderingItem = '[Order] Cancel ordering item',

  OrderNewItem = '[Orders] Order new item',
  OrderNewItemSuccess = '[Orders] Order new item success',
  OrderNewItemFailed = '[Orders] Order new item failed',

  NewOrderAdded = '[Orders] New order added',
  NewItemAdded = '[Orders] New item added',

  OnEventNewOrderAdded = '[Orders] On event new order added',
  OnEventOrderItemAdded = '[Orders] On event order item added',
  OnEventOrderItemRemoved = '[Orders] On event order item removed',
  OnEventResponsiblePersonSelected = '[Orders] On event responsible person selected',
  OnEventResponsiblePersonRemoved = '[Orders] On event responsible person removed',

  OnEventLocalAdded = '[Orders] On event local added',
  OnEventLocalRenamed = '[Orders] On event local renamed',
  OnEventLocalRemoved = '[Orders] On event local removed',
  OnEventLocalAliasAdded = '[Orders] On event local alias added',
  OnEventLocalAliasRemoved = '[Orders] On event local alias removed'
}

export class LoadOrders implements Action {
  readonly type = ActionTypes.LoadOrders;
}

export class LoadOrdersSuccess implements Action {
  readonly type = ActionTypes.LoadOrdersSuccess;

  constructor(public orders: Order[]) {}
}

export class LoadOrdersFailed implements Action {
  readonly type = ActionTypes.LoadOrdersFailed;

  constructor(public error: string) {}
}

export class LoadLocals implements Action {
  readonly type = ActionTypes.LoadLocals;
}

export class LoadLocalsSuccess implements Action {
  readonly type = ActionTypes.LoadLocalsSuccess;

  constructor(public locals: Local[]) {}
}

export class LoadLocalsFailed implements Action {
  readonly type = ActionTypes.LoadLocalsFailed;

  constructor(public error: string) {}
}

export class StartOrderingItem implements Action {
  readonly type = ActionTypes.StartOrderingItem;

  constructor(public orderingMode: OrderingMode) {}
}

export class CancelOrderingItem implements Action {
  readonly type = ActionTypes.CancelOrderingItem;
}

export class OrderNewItem implements Action {
  readonly type = ActionTypes.OrderNewItem;

  constructor(public command: OrderItemCommand) {}
}

export class OrderNewItemSuccess implements Action {
  readonly type = ActionTypes.OrderNewItemSuccess;
}

export class OrderNewItemFailed implements Action {
  readonly type = ActionTypes.OrderNewItemFailed;

  constructor(public error: string) {}
}

export class OnEventNewOrderAdded implements Action {
  readonly type = ActionTypes.OnEventNewOrderAdded;

  constructor(
    public orderId: string,
    public date: Date,
    public localId: string
  ) {}
}

export class OnEventOrderItemAdded implements Action {
  readonly type = ActionTypes.OnEventOrderItemAdded;

  constructor(
    public orderId: string,
    public itemName: string,
    public personName: string
  ) {}
}

export class OnEventOrderItemRemoved implements Action {
  readonly type = ActionTypes.OnEventOrderItemRemoved;

  constructor(
    public orderId: string,
    public itemName: string,
    public personName: string
  ) {}
}

export class OnEventResponsiblePersonSelected implements Action {
  readonly type = ActionTypes.OnEventResponsiblePersonSelected;

  constructor(public orderId: string, public personName: string) {}
}

export class OnEventResponsiblePersonRemoved implements Action {
  readonly type = ActionTypes.OnEventResponsiblePersonRemoved;

  constructor(public orderId: string) {}
}

export class OnEventLocalAdded implements Action {
  readonly type = ActionTypes.OnEventLocalAdded;

  constructor(public id: string, public name: string) {}
}

export class OnEventLocalRenamed implements Action {
  readonly type = ActionTypes.OnEventLocalRenamed;

  constructor(public id: string, public newName: string) {}
}

export class OnEventLocalRemoved implements Action {
  readonly type = ActionTypes.OnEventLocalRemoved;

  constructor(public id: string) {}
}

export class OnEventLocalAliasAdded implements Action {
  readonly type = ActionTypes.OnEventLocalAliasAdded;

  constructor(public localId: string, public alias: string) {}
}

export class OnEventLocalAliasRemoved implements Action {
  readonly type = ActionTypes.OnEventLocalAliasRemoved;

  constructor(public localId: string, public alias: string) {}
}

export type OrderActions =
  | LoadOrders
  | LoadOrdersSuccess
  | LoadOrdersFailed
  | LoadLocals
  | LoadLocalsSuccess
  | LoadLocalsFailed
  | StartOrderingItem
  | CancelOrderingItem
  | OrderNewItem
  | OrderNewItemSuccess
  | OrderNewItemFailed
  | OnEventNewOrderAdded
  | OnEventOrderItemAdded
  | OnEventOrderItemRemoved
  | OnEventResponsiblePersonSelected
  | OnEventResponsiblePersonRemoved
  | OnEventLocalAdded
  | OnEventLocalRenamed
  | OnEventLocalRemoved
  | OnEventLocalAliasAdded
  | OnEventLocalAliasRemoved;
