export class Event {
  type: string;
  data: any;
}

// export enum EventTypes {
//   NewOrderStarted = 'NewOrderStarted',
//   OrderItemAdded = 'OrderItemAdded',
//   OrderResponsiblePersonSelected = 'OrderResponsiblePersonSelected',
//   OrderItemRemoved = 'OrderItemRemoved',
//   OrderResponsiblePersonRemoved = 'OrderResponsiblePersonRemoved'
// }

// export class NewOrderStarted {
//   readonly type = EventTypes.NewOrderStarted;

//   constructor(
//     public orderId: string,
//     public date: Date,
//     public localId: string
//   ) {}
// }

// export class OrderItemAdded {
//   readonly type = EventTypes.OrderItemAdded;

//   constructor(
//     public orderId: string,
//     public itemName: string,
//     public personName: string
//   ) {}
// }

// export class OrderResponsiblePersonSelected {
//   readonly type = EventTypes.OrderResponsiblePersonSelected;

//   constructor(public orderId: string, public personName: string) {}
// }

// export class OrderItemRemoved {
//   readonly type = EventTypes.OrderItemRemoved;

//   constructor(
//     public orderId: string,
//     public itemName: string,
//     public personName: string
//   ) {}
// }

// export class OrderResponsiblePersonRemoved {
//   readonly type = EventTypes.OrderResponsiblePersonRemoved;

//   constructor(public orderId: string) {}
// }

// export type Events =
//   | NewOrderStarted
//   | OrderItemAdded
//   | OrderResponsiblePersonSelected
//   | OrderItemRemoved
//   | OrderResponsiblePersonRemoved;
