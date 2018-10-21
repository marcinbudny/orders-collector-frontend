export class Order {
  id: string;
  date: Date;
  localId: string;
  responsiblePerson: string | null;
  items: OrderItem[];
}

export class OrderItem {
  itemName: string;
  personName: string;
}
