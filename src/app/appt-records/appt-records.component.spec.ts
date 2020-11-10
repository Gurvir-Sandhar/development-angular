import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule} from '@angular/common/http/testing';
import { ApptRecordsComponent } from './appt-records.component';

describe('ApptRecordsComponent', () => {
  let component: ApptRecordsComponent;
  let fixture: ComponentFixture<ApptRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApptRecordsComponent ],
      imports: [ HttpClientTestingModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApptRecordsComponent);
    component = fixture.componentInstance;
    component.ngOnInit = () => {};
    // TODO: INSERT TEST DATA INTO COMPONENT
    component.recordData = {
      name: 'test_data_name',
      contact: 'no'
    };
    fixture.detectChanges();
  });
  // check if created
  it('should create', () => {
    expect(component).toBeDefined();
  });
  // TODO: WRITE TEST FOR TESTING DATA
  it('should have name', () => {
    expect(component.recordData.name).toEqual("test_data_name");
  })
  //
});
