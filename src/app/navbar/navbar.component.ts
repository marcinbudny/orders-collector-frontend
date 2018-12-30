import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import * as fromOrders from '../state/order.reducer';
import * as orderActions from '../state/order.actions';

import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog
} from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private store: Store<fromOrders.OrdersState>
  ) {}

  private componentActive = true;
  personName: string | null;

  ngOnInit() {
    this.store
      .pipe(
        select(fromOrders.getPersonName),
        takeWhile(_ => this.componentActive)
      )
      .subscribe(name => (this.personName = name));

    // todo: move storage responsibility out of this component
    const personName = this.loadPersonName();
    if (!personName) {
      // see: https://github.com/angular/material2/issues/5268
      setTimeout(() => this.openLoginDialog(), 0);
    } else {
      this.store.dispatch(new orderActions.SetPersonName(personName));
    }
  }

  changePersonName() {
    this.openLoginDialog();
  }

  loadPersonName() {
    return localStorage.getItem('personName');
  }

  savePersonName(personName: string) {
    localStorage.setItem('personName', personName);
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      autoFocus: true,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.savePersonName(result.personName);
      this.store.dispatch(new orderActions.SetPersonName(result.personName));
    });
  }
}

@Component({
  selector: 'app-login-dialog',
  templateUrl: 'login-dialog.html'
})
export class LoginDialogComponent {
  personName = new FormControl(null, Validators.required);

  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>) {}

  onOk(): void {
    if (this.personName.valid) {
      this.dialogRef.close({ personName: this.personName.value });
    }
  }
}
