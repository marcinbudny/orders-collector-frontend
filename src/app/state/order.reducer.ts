import { Order, OrderItem } from '../model/order';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { OrderActions, ActionTypes } from './order.actions';
import { Local } from '../model/local';
import { Action } from 'rxjs/internal/scheduler/Action';

export class NewItemInOrder {
  constructor(public orderId: string) {}
}
export type OrderingMode = 'not ordering' | 'new order' | NewItemInOrder;

export class OrderItemCommandInProgress {
  constructor(public commandId: string, public orderId: string | null) {}
}

export class SelectResponsiblePersonCommandInProgress {
  constructor(public commandId: string, public orderId: string) {}
}

export class RemoveItemCommandInProgress {
  constructor(
    public commandId: string,
    public orderId: string,
    public personName: string
  ) {}
}

export type CommandInProgress =
  | 'none'
  | OrderItemCommandInProgress
  | SelectResponsiblePersonCommandInProgress
  | RemoveItemCommandInProgress;

export interface OrdersState {
  locals: Local[];
  orders: Order[];
  error: any;
  orderingMode: OrderingMode;
  commandInProgress: CommandInProgress;
  personName: string | null;
}

const initialState: OrdersState = {
  locals: [],
  orders: [],
  error: null,
  orderingMode: 'not ordering',
  commandInProgress: 'none',
  personName: null
};

const getOrdersFeature = createFeatureSelector<OrdersState>('orders');

export const getOrders = createSelector(
  getOrdersFeature,
  state => state.orders
);

export const getLocals = createSelector(
  getOrdersFeature,
  state => state.locals
);

export const getOrderingItemForOrderId = createSelector(
  getOrdersFeature,
  state => state.orderingMode
);

export const commandInProgress = createSelector(
  getOrdersFeature,
  state => state.commandInProgress
);

export const getError = createSelector(
  getOrdersFeature,
  state => state.error
);

export const getPersonName = createSelector(
  getOrdersFeature,
  state => state.personName
);

export function reducer(
  state = initialState,
  action: OrderActions
): OrdersState {
  // state = ensureEventCompletesCommandInProgress(action, state);

  switch (action.type) {
    case ActionTypes.LoadOrdersSuccess:
      return {
        ...state,
        orders: action.orders,
        error: null,
        commandInProgress: 'none'
      };

    case ActionTypes.LoadOrdersFailed:
      return {
        ...state,
        error: action.error,
        orders: [],
        commandInProgress: 'none'
      };

    case ActionTypes.LoadLocalsSuccess:
      return {
        ...state,
        locals: action.locals,
        error: null
      };

    case ActionTypes.LoadLocalsFailed:
      return {
        ...state,
        locals: [],
        error: action.error
      };

    case ActionTypes.StartOrderingItem:
      return {
        ...state,
        orderingMode: action.orderingMode
      };

    case ActionTypes.CancelOrderingItem:
      return {
        ...state,
        orderingMode: 'not ordering'
      };

    case ActionTypes.OrderNewItem:
      return {
        ...state,
        commandInProgress: new OrderItemCommandInProgress(
          action.command.commandId,
          state.orderingMode instanceof NewItemInOrder
            ? state.orderingMode.orderId
            : null
        )
      };

    // case ActionTypes.OrderNewItemSuccess:
    //   return {
    //     ...state,
    //     orderingMode: 'not ordering',
    //     error: null
    //   };

    case ActionTypes.OrderNewItemFailed:
      return {
        ...state,
        error: action.error
      };

    case ActionTypes.SelectResponsiblePerson:
      return {
        ...state,
        commandInProgress: new SelectResponsiblePersonCommandInProgress(
          action.command.commandId,
          action.command.orderId
        )
      };

    case ActionTypes.SelectResponsiblePersonFailed:
      return {
        ...state,
        commandInProgress: 'none',
        error: action.error
      };

    case ActionTypes.RemoveItem:
      return {
        ...state,
        commandInProgress: new RemoveItemCommandInProgress(
          action.command.commandId,
          action.command.orderId,
          action.command.personName
        )
      };

    case ActionTypes.RemoveItemFailed:
      return {
        ...state,
        commandInProgress: 'none',
        error: action.error
      };

    case ActionTypes.OnEventNewOrderAdded:
      return {
        ...state,
        orders: [
          ...state.orders,
          {
            id: action.orderId,
            date: action.date,
            localId: action.localId,
            responsiblePerson: null,
            items: []
          }
        ]
      };

    case ActionTypes.OnEventOrderItemAdded:
      state = replaceOrder(state, action.orderId, order =>
        orderWithItem(order, {
          itemName: action.itemName,
          personName: action.personName
        })
      );

      if (
        state.commandInProgress instanceof OrderItemCommandInProgress &&
        state.commandInProgress.commandId === action.raisedByCommandId
      ) {
        return {
          ...state,
          orderingMode: 'not ordering',
          commandInProgress: 'none',
          error: null
        };
      }

      return state;

    case ActionTypes.OnEventOrderItemRemoved:
      state = replaceOrder(state, action.orderId, order =>
        orderWithoutItem(order, {
          itemName: action.itemName,
          personName: action.personName
        })
      );

      if (
        state.commandInProgress instanceof RemoveItemCommandInProgress &&
        state.commandInProgress.commandId === action.raisedByCommandId
      ) {
        return {
          ...state,
          commandInProgress: 'none',
          error: null
        };
      }

      return state;

    case ActionTypes.OnEventResponsiblePersonSelected:
      state = replaceOrder(state, action.orderId, order =>
        orderWithResponsiblePerson(order, action.personName)
      );

      if (
        state.commandInProgress instanceof
          SelectResponsiblePersonCommandInProgress &&
        state.commandInProgress.commandId === action.raisedByCommandId
      ) {
        return {
          ...state,
          commandInProgress: 'none',
          error: null
        };
      }

      return state;

    case ActionTypes.OnEventResponsiblePersonRemoved:
      return replaceOrder(state, action.orderId, order =>
        orderWithoutResponsiblePerson(order)
      );

    case ActionTypes.OnEventLocalAdded:
      return {
        ...state,
        locals: [
          ...state.locals,
          { id: action.id, name: action.name, aliases: [] }
        ]
      };

    case ActionTypes.OnEventLocalRenamed:
      return replaceLocal(state, action.id, local =>
        localWithName(local, action.newName)
      );

    case ActionTypes.OnEventLocalRemoved:
      return {
        ...state,
        locals: state.locals.filter(l => l.id !== action.id)
      };

    case ActionTypes.OnEventLocalAliasAdded:
      return replaceLocal(state, action.localId, local =>
        localWithAlias(local, action.alias)
      );

    case ActionTypes.OnEventLocalAliasRemoved:
      return replaceLocal(state, action.localId, local =>
        localWithoutAlias(local, action.alias)
      );

    case ActionTypes.SetPersonName:
      return {
        ...state,
        personName: action.personName
      };

    default:
      return state;
  }
}

function replaceOrder(
  state: OrdersState,
  orderId: string,
  orderFactory: (Order) => Order
): OrdersState {
  const index = state.orders.findIndex(o => o.id === orderId);
  return {
    ...state,
    orders: [
      ...state.orders.slice(0, index),
      orderFactory(state.orders[index]),
      ...state.orders.slice(index + 1)
    ]
  };
}

function orderWithItem(order: Order, item: OrderItem): Order {
  return {
    ...order,
    items: [...order.items, item]
  };
}

function orderWithoutItem(order: Order, item: OrderItem): Order {
  return {
    ...order,
    items: order.items.filter(
      i => i.itemName !== item.itemName && i.personName !== item.personName
    )
  };
}

function orderWithResponsiblePerson(order: Order, personName: string): Order {
  return {
    ...order,
    responsiblePerson: personName
  };
}

function orderWithoutResponsiblePerson(order: Order): Order {
  return {
    ...order,
    responsiblePerson: null
  };
}

function replaceLocal(
  state: OrdersState,
  localId: string,
  localFactory: (Local) => Local
): OrdersState {
  const index = state.locals.findIndex(l => l.id === localId);
  return {
    ...state,
    locals: [
      ...state.locals.slice(0, index),
      localFactory(state.locals[index]),
      ...state.locals.slice(index + 1)
    ]
  };
}

function localWithName(local: Local, newName: string): Local {
  return { ...local, name: newName };
}

function localWithAlias(local: Local, alias: string): Local {
  return { ...local, aliases: [...local.aliases, alias] };
}

function localWithoutAlias(local: Local, alias: string): Local {
  return { ...local, aliases: [...local.aliases.filter(a => a !== alias)] };
}
