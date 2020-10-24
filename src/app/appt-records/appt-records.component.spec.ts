import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApptRecordsComponent } from './appt-records.component';

describe('ApptRecordsComponent', () => {
  let component: ApptRecordsComponent;
  let fixture: ComponentFixture<ApptRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApptRecordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApptRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
