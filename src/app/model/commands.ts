export class OrderItemCommand {
  localId: string;
  itemName: string;
  personName: string;
  commandId: string;
}

export class SelectResponsiblePerson {
  orderId: string;
  commandId: string;
}

export class RemoveItem {
  orderId: string;
  personName: string;
  commandId: string;
}
