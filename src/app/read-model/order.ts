export class Order {
  id: string;
  date: Date;
  localId: string;
  localName: string;
  responsiblePerson?: string;
  items: OrderItem[];
}

export class OrderItem {
  itemName: string;
  personName: string;
}
