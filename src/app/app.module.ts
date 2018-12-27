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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NewOrderComponent } from './new-order/new-order.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
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
    ReactiveFormsModule,
    StoreModule.forRoot({ orders: fromOrders.reducer }),
    EffectsModule.forRoot([OrderEffects]),
    StoreDevtoolsModule.instrument({
      name: 'APM Demo App DevTools',
      maxAge: 25,
      logOnly: environment.production
    }),
    BrowserAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCardModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
