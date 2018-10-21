import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventNotificationsService } from './services/event-notifications/event-notifications.service';
import { takeWhile } from 'rxjs/operators';
import { EventToActionMapperService } from './services/event-to-action-mapper/event-to-action-mapper.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private componentActive = true;

  constructor(
    private eventNotifications: EventNotificationsService,
    private eventToActionMapper: EventToActionMapperService
  ) {
    this.eventNotifications
      .getConnectionStatusStream()
      .pipe(takeWhile(() => this.componentActive))
      .subscribe(status =>
        console.log(`Event notification connection is now in status: ${status}`)
      );

    this.eventNotifications
      .getEventStream()
      .pipe(takeWhile(() => this.componentActive))
      .subscribe(event =>
        console.log(
          `Received event of type ${event.type} with data ${JSON.stringify(
            event
          )}`
        )
      );

    this.eventToActionMapper.mapEventsFrom(
      this.eventNotifications.getEventStream()
    );
  }

  ngOnInit() {
    this.eventNotifications.connect();
  }

  ngOnDestroy() {
    this.eventNotifications.close();
  }
}
