import { TestBed, inject } from '@angular/core/testing';

import { EventNotificationsService } from './event-notifications.service';

describe('EventNotificationsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventNotificationsService]
    });
  });

  it('should be created', inject([EventNotificationsService], (service: EventNotificationsService) => {
    expect(service).toBeTruthy();
  }));
});
