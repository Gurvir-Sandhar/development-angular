import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentInteractionComponent } from './student-interaction.component';

describe('StudentInteractionComponent', () => {
  let component: StudentInteractionComponent;
  let fixture: ComponentFixture<StudentInteractionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentInteractionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
