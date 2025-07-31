import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportTicketDetailComponent } from './ticket-detail';

describe('SupportTicketDetailComponent', () => {
  let component: SupportTicketDetailComponent;
  let fixture: ComponentFixture<SupportTicketDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportTicketDetailComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SupportTicketDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
