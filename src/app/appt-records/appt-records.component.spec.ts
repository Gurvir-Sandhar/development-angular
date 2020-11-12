import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule} from '@angular/common/http/testing';
import { ApptRecordsComponent } from './appt-records.component';
import { By } from '@angular/platform-browser';

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
      contact: 'yes',
      id: '123456',
      email: 'test_email@test.test'
    };
    fixture.detectChanges();
  });
  // check if created
  it('should create', () => {
    expect(component).toBeDefined();
  });
  // TODO: WRITE TEST FOR TESTING DATA
  it('should have name', () => {
    expect(component.recordData.name).toEqual('test_data_name');
  });
  it('should have id', () => {
    expect(component.recordData.id).toEqual('123456');
  });
  it('should have email', () => {
    expect(component.recordData.email).toEqual('test_email@test.test');
  });
  it('should have contact', () => {
    expect(component.recordData.contact).toEqual('yes');
  });

  it('footer', () => {
    const contact =  fixture.debugElement.query(By.css('tab_advisingContact'));
    expect(contact).toBeDefined();

    const history =  fixture.debugElement.query(By.css('tab_interactionHistory'));
    expect(history).toBeDefined();

    const interaction =  fixture.debugElement.query(By.css('tab_interactionCreate'));
    expect(interaction).toBeDefined();

    const attachment =  fixture.debugElement.query(By.css('tab_contactAttachments'));
    expect(attachment).toBeDefined();

  });
  //
});
