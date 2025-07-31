import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUsersDetailComponent } from './admin-users-detail';

describe('AdminUsersDetail', () => {
  let component: AdminUsersDetailComponent;
  let fixture: ComponentFixture<AdminUsersDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUsersDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUsersDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
