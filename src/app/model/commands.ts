export class OrderItemCommand {
  localId: string;
  itemName: string;
  personName: string;
}

export class SelectResponsiblePerson {
  orderId: string;
}

export class RemoveItem {
  orderId: string;
  personName: string;
}
