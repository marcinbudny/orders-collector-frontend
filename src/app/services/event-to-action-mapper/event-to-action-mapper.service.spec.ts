import { TestBed, inject } from '@angular/core/testing';

import { EventToActionMapperService } from './event-to-action-mapper.service';

describe('EventToActionMapperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventToActionMapperService]
    });
  });

  it('should be created', inject([EventToActionMapperService], (service: EventToActionMapperService) => {
    expect(service).toBeTruthy();
  }));
});
