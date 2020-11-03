import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ApptTablesComponent } from './appt-tables.component';
import { HttpClientTestingModule} from '@angular/common/http/testing';
import testData from '../testData';

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
    },
    {
      id: '7',
      condition: 'Finished',
      contactName: 'Sam Student7',
      contactId: '106',
      interactionOwnerName: 'Adam Advisor',
      interactionId: '80',
      ownerName: 'Adam Advisor',
      subject: 'graduation',
      teamName: 'Red Team',
      name: 'Sam7',
      time: '10:00 AM - 10:50 AM'
    },
    {
      id: '8',
      condition: 'Finished',
      contactName: 'Sam Student8',
      contactId: '107',
      interactionOwnerName: 'Adam Advisor',
      interactionId: '90',
      ownerName: 'Adam Advisor',
      subject: 'graduation',
      teamName: 'Red Team',
      name: 'Sam8',
      time: '10:00 AM - 10:50 AM'
    },
    {
      id: '9',
      condition: 'Finished',
      contactName: 'Sam Student9',
      contactId: '108',
      interactionOwnerName: 'Adam Advisor',
      interactionId: '100',
      ownerName: 'Adam Advisor',
      subject: 'graduation',
      teamName: 'Red Team',
      name: 'Sam9',
      time: '10:00 AM - 10:50 AM'
    },
    {
      id: '10',
      condition: 'Finished',
      contactName: 'Sam Student10',
      contactId: '109',
      interactionOwnerName: 'Adam Advisor',
      interactionId: '110',
      ownerName: 'Adam Advisor',
      subject: 'graduation',
      teamName: 'Red Team',
      name: 'Sam10',
      time: '10:00 AM - 10:50 AM'
    },
    {
      id: '11',
      condition: 'Finished',
      contactName: 'Sam Student11',
      contactId: '110',
      interactionOwnerName: 'Adam Advisor',
      interactionId: '120',
      ownerName: 'Adam Advisor',
      subject: 'graduation',
      teamName: 'Red Team',
      name: 'Sam11',
      time: '10:00 AM - 10:50 AM'
    },
    {
      id: '12',
      condition: 'No-show',
      contactName: 'Sam Student12',
      contactId: '111',
      interactionOwnerName: 'Adam Advisor',
      interactionId: '130',
      ownerName: 'Adam Advisor',
      subject: 'graduation',
      teamName: 'Red Team',
      name: 'Sam12',
      time: '10:00 AM - 10:50 AM'
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
    // redefines ngOnInit() so we can use our own testData
    component.ngOnInit = () => {};
    component.appointments = component.sort(testData);
    fixture.detectChanges();
  });

  it('apply requiring all filter', () => {
    component.filterRA({data: 'abc'}, 2, 'masters program');
    // check a name is there
    expect(component.tables[2].source).toContain(jasmine.objectContaining({subject: 'masters program'}));
    // check a similar name isn't
    expect(component.tables[2].source).not.toContain(jasmine.objectContaining({subject: 'postbacc program'}));
    // check a different name isn't
    expect(component.tables[2].source).not.toContain(jasmine.objectContaining({subject: 'graduation'}));
  });
  it('apply matching any filter', () => {
    // apply filter
    component.filterME({ data: 'abc' }, 2, 'masters program');
    // check a name is there
    expect(component.tables[2].source).toContain(jasmine.objectContaining({subject: 'masters program'}));
    // check a similar name is
    expect(component.tables[2].source).toContain(jasmine.objectContaining({subject: 'postbacc program'}));
    // check a different name isn't
    expect(component.tables[2].source).not.toEqual(jasmine.objectContaining('graduation'));
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

  // test to fill tables correctly and check if status change will changes tables
  it ('should fill tables correctly', () => {
    // there are a total of 13 records in testData but only 12 should show on the tables
    expect(component.tables[0].source.length).toBe(2);
    expect(component.tables[1].source.length).toBe(1);
    expect(component.tables[2].source.length).toBe(9);
    // take row out a specific table and insert into a different table
    // queue to in-progress
    component.updateCondition(component.meetingConditions[2], component.tables[0].source[0], 1 );
    expect(component.tables[1].source.length).toBe(2);
    // in-progress to finished
    component.updateCondition(component.meetingConditions[3], component.tables[1].source[0], 2);
    expect(component.tables[2].source.length).toBe(10);
  });

  // example test - asserts appointments by status
  // example test - asserts table index value can change and paging functions
  it ('assert table range changes', () => {
    expect(component.tables[2].range).toBe(25);
    component.changeRange(5, 2);
    expect(component.tables[2].range).toBe(5);
    component.updateTablePagesInfo(2);
  });

  // example test - asserts table can change pages
  it ('assert table page changes', () => {
    expect(component.tables[0].page).toBe(1);
    component.nextPage(0);
    expect(component.tables[0].page).toBe(1);
  });

  // test to show number of entries are shown correctly
  it ('should update entries', () => {
    expect(component.tables[0].total).toBe(1);
    expect(component.tables[1].total).toBe(1);
    expect(component.tables[2].total).toBe(10);
  });
});
