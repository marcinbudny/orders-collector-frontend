import { Injectable } from '@angular/core';
import { HubConnection, LogLevel, HubConnectionBuilder } from '@aspnet/signalr';
import { Subject, Observable } from 'rxjs';
import { Event } from '../../model/events';

export type ConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'closing'
  | 'closed';

@Injectable({
  providedIn: 'root'
})
export class EventNotificationsService {
  private connection: HubConnection;
  private shouldBeConnected = false;

  private connectionStatusStream = new Subject<ConnectionStatus>();
  connectionStatus: ConnectionStatus;

  private eventStream = new Subject<Event>();

  constructor() {
    this.connectionStatusStream.subscribe(
      status => (this.connectionStatus = status)
    );
  }

  getConnectionStatusStream(): Observable<ConnectionStatus> {
    return this.connectionStatusStream;
  }

  getEventStream(): Observable<Event> {
    return this.eventStream;
  }

  connect(): void {
    this.shouldBeConnected = true;

    this.reconnect();
  }

  close(): void {
    this.connectionStatusStream.next('closing');
    this.shouldBeConnected = false;
    if (this.connection != null) {
      this.connection
        .stop()
        .then(() => this.connectionStatusStream.next('closed'));
    }
  }

  private reconnect(): void {
    if (!this.shouldBeConnected) {
      return;
    }

    this.connectionStatusStream.next('connecting');

    this.connection = new HubConnectionBuilder()
      .withUrl('http://localhost:5000/events')
      .configureLogging(LogLevel.Information)
      .build();

    this.connection.on('event', (event: Event) => this.onEvent(event));

    this.connection.onclose(() => {
      if (this.shouldBeConnected) {
        this.connectionStatusStream.next('connecting');
        setTimeout(() => this.reconnect(), 1000);
      }
    });

    this.connection
      .start()
      .then(() => this.connectionStatusStream.next('connected'))
      .catch(err => {
        console.error(err.toString());
        setTimeout(() => this.reconnect(), 1000);
      });
  }

  private onEvent(event: Event): void {
    this.eventStream.next(event);
  }
}
