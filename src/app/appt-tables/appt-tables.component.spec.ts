import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ApptTablesComponent } from './appt-tables.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ApptTablesComponent', () => {
  let component: ApptTablesComponent;
  let fixture: ComponentFixture<ApptTablesComponent>;

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
    expect(component.tables[0].page).toBe(2);
  });
});
