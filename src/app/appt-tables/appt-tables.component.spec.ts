import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ApptTablesComponent } from './appt-tables.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ApptTablesComponent', () => {
  let component: ApptTablesComponent;
  let fixture: ComponentFixture<ApptTablesComponent>;

  // test data resembles api data but with only the data appt-tables needs
  // this data will help keep tests consistent
  const testData = [
    {
      id: '0',
      condition: 'Scheduled',
      contactName: 'Sam Student0',
      contactId: '99',
      interactionOwnerName: 'Adam Advisor',
      interactionId: '10',
      ownerName: 'Adam Advisor',
      subject: 'graduation',
      teamName: 'Red Team',
      name: 'Sam0',
      time: '10:00 AM - 10:50 AM'
    },
    {
      id: '1',
      condition: 'Checked In',
      contactName: 'Sam Student1',
      contactId: '100',
      interactionOwnerName: 'Adam Advisor',
      interactionId: '20',
      ownerName: 'Adam Advisor',
      subject: 'graduation',
      teamName: 'Red Team',
      name: 'Sam1',
      time: '10:00 AM - 10:50 AM'
    },
    {
      id: '2',
      condition: 'Active',
      contactName: 'Sam Student2',
      contactId: '101',
      interactionOwnerName: 'Adam Advisor',
      interactionId: '30',
      ownerName: 'Adam Advisor',
      subject: 'graduation',
      teamName: 'Red Team',
      name: 'sam2',
      time: '10:00 AM - 10:50 AM'
    },
    {
      id: '3',
      condition: 'Canceled',
      contactName: 'Sam Student3',
      contactId: '102',
      interactionOwnerName: 'Adam Advisor',
      interactionId: '40',
      ownerName: 'Adam Advisor',
      subject: 'graduation',
      teamName: 'Red Team',
      name: 'Sam3',
      time: '10:00 AM - 10:50 AM'
    },
    {
      id: '4',
      condition: 'Finished',
      contactName: 'Sam Student4',
      contactId: '103',
      interactionOwnerName: 'Adam Advisor',
      interactionId: '50',
      ownerName: 'Adam Advisor',
      subject: 'graduation',
      teamName: 'Red Team',
      name: 'Sam4',
      time: '10:00 AM - 10:50 AM'
    },
    {
      id: '5',
      condition: 'No-show',
      contactName: 'Sam Student5',
      contactId: '104',
      interactionOwnerName: 'Adam Advisor',
      interactionId: '60',
      ownerName: 'Adam Advisor',
      subject: 'graduation',
      teamName: 'Red Team',
      name: 'Sam5',
      time: '10:00 AM - 10:50 AM'
    },
    {
      id: '6',
      condition: '(Test)',
      contactName: 'Sam Student6',
      contactId: '105',
      interactionOwnerName: 'Adam Advisor',
      interactionId: '70',
      ownerName: 'Adam Advisor',
      subject: 'graduation',
      teamName: 'Red Team',
      name: 'Sam6',
      time: '10:00 AM - 10:50'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApptTablesComponent ],
      imports: [ HttpClientTestingModule ]
    })
    .compileComponents();
  });
  // setup for before each test
  beforeEach(() => {
    fixture = TestBed.createComponent(ApptTablesComponent);
    component = fixture.componentInstance;
    component.ngOnInit = () => {};
    component.appointments = component.sort(testData);
    component.initializeAllArrays();
    fixture.detectChanges();
  });


  /* four test to write:
    1. three tables of appointments displayed in tables by status
    2. tables limit number of entries to display
    3. able to index through pages of table
    4. display number of page tables correctly
   */

  // example test - asserts 1 == 1
  it('simply assert true is true', () => {
    expect(true).toEqual(true);
  });
  // example test - asserts component exists
  it ('assert tables to exist', () => {
    expect(component).toBeDefined();
    expect(component.tables[0].name).toContain('Queue');
    expect(component.tables[1].name).toContain('Progress');
    expect(component.tables[2].name).toContain('Complete');
  });
  // example test - asserts appointments by status
  // example test - asserts table index value can change and paging functions
  it ('assert table range changes', () => {
    expect(component.tables[0].range).toBe(25);
    component.changeRange(5, 0);
    expect(component.tables[0].range).toBe(5);
  });
  // example test - asserts table can change pages
  it ('assert table page changes', () => {
    expect(component.tables[0].page).toBe(1);
    component.nextPage(0);
    expect(component.tables[0].page).toBe(1);
  });

  it ('should fill tables correctly', () => {
    // there are a total of 7 records in testData but only 6 should show on the tables
    expect(component.tables[0].source.length).toBe(2);
    expect(component.tables[1].source.length).toBe(1);
    expect(component.tables[2].source.length).toBe(3);

    // take row out a specific table and insert into a different table
    // queue to in progress
    component.updateCondition(component.meetingConditions[2], component.tables[0].source[0], 1 );
    expect(component.tables[1].source.length).toBe(2);
    // in progress to finished
    component.updateCondition(component.meetingConditions[3], component.tables[1].source[0], 2);
    expect(component.tables[2].source.length).toBe(4);
  });

});
