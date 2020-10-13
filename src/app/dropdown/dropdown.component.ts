import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit {

  // Lists fetched from api
  users;
  appointments;
  // TODO: get team data from API
  teams = ['Red', 'Blue', 'Green', 'White', 'Black']

  // Variables decided by user
  teamId;
  userId;
  currentDate;
  dateString;

  constructor(
    private api: ApiService) {}

  ngOnInit() {
    this.getUsers();
    this.refresh();
    // get current date
    this.getDate(undefined);
  }

  form = new FormGroup({
    dropdown: new FormControl('', Validators.required)
  });

  selectTeam(item) {
    var team: string= item.target.value;
    console.log(team);

    this.teamId = this.teams.findIndex(i => i == team);
    console.log(this.teamId);

    this.updateFilters();
  }

  selectUser(item) {
    var user: string = item.target.value;
    console.log(user);

    var index = this.users.findIndex(i => i.name == user)
    this.userId = this.users[index].id;
    console.log(this.userId)

    this.updateFilters();
  }

  getUsers() {
    this.users = this.api.query('users').subscribe(Response =>
      this.users = Response)
  }

  getDate(date) {
    // if undefined or empty set to current date
    if (date == undefined || date == '')
      this.currentDate = new Date();
    else {
      this.currentDate = new Date(date);
    }
    this.dateString = this.currentDate.getFullYear() + '-'
      + (this.currentDate.getMonth() + 1) + '-'
      + this.currentDate.getUTCDate();
    console.log(this.dateString);
  }

  formatDate(val) {
    //NOTE: To ensure the locale and timezone match, can
    //alternately set the timeZone in the options to UTC.
    return val.toLocaleDateString("en-US"
      , { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  applyDate(item) {
    this.getDate(item.target.value);
    console.log(this.currentDate);
    this.updateFilters();
  }

  updateFilters() {
    // /apps/api/test/filters/?teamId=(teamID)&pickOwner=(userID)&pickDay=(today)

    this.api.stateQuery(this.teamId, this.userId, 
      this.dateString)
    .subscribe()

    // Unsure what to do with returned value.
    // Even in demo the query always 404s
  }

  refresh(){
    this.api.query('appointments')
    .subscribe(Response => {
      this.appointments = Response;
    })
  }
}