import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { OrderComponent } from './order/order.component';
import { OrderListComponent } from './order-list/order-list.component';
import { StoreModule } from '@ngrx/store';
import * as fromOrders from './state/order.reducer';
import { EffectsModule } from '@ngrx/effects';
import { OrderEffects } from './state/order.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NewOrderComponent } from './new-order/new-order.component';

@NgModule({
  declarations: [
    AppComponent,
    OrderComponent,
    OrderListComponent,
    NewOrderComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    StoreModule.forRoot({ orders: fromOrders.reducer }),
    EffectsModule.forRoot([OrderEffects]),
    StoreDevtoolsModule.instrument({
      name: 'APM Demo App DevTools',
      maxAge: 25,
      logOnly: environment.production
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
