import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApptTablesComponent } from './appt-tables.component';
import { HttpClientTestingModule} from '@angular/common/http/testing';
import testData from '../testData';

describe('ApptTablesComponent', () => {
  let component: ApptTablesComponent;
  let fixture: ComponentFixture<ApptTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApptTablesComponent ]
    })
    .compileComponents();
  });

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
    component.filterMA({ data: 'abc' }, 2, 'masters program');
    // check a name is there
    expect(component.tables[2].source).toContain(jasmine.objectContaining({subject: 'masters program'}));
    // check a similar name is
    expect(component.tables[2].source).toContain(jasmine.objectContaining({subject: 'postbacc program'}));
    // check a different name isn't
    expect(component.tables[2].source).not.toEqual(jasmine.objectContaining({subject: 'graduation'}));
    component.initializeAllArrays();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
