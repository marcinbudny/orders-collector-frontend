import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api/api.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: Order[];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.getOrders();
  }

  getOrders(): void {
    this.api.getOrdersForToday().subscribe(orders => (this.orders = orders));
  }
}
