import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StateFilterComponent } from './state-filter.component';
import { HttpClientTestingModule} from '@angular/common/http/testing';

describe('StateFilterComponent', () => {
  let component: StateFilterComponent;
  let fixture: ComponentFixture<StateFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StateFilterComponent ],
      imports: [ HttpClientTestingModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StateFilterComponent);
    component = fixture.componentInstance;
    // redefines ngOnInit() so we can load testing data
    component.ngOnInit = () => {};
    component.userId = 'test user';
    component.teamId = 'test team';
    fixture.detectChanges();
  });

  it('state-filter should exist', () => {
    expect(component).toBeDefined();
  });
  it('state-filter should have a user', () => {
    expect(component.userId).toEqual('test user');
  });
  it('state-filter should have a team', () => {
    expect(component.teamId).toEqual('test team');
  });
  it('state-filter should have a date', () => {
    component.currentDate = new Date();
    expect(component.currentDate).toEqual(new Date());
  });
});
