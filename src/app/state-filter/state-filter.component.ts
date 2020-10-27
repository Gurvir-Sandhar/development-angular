import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-state-filter',
  templateUrl: './state-filter.component.html',
  styleUrls: ['./state-filter.component.css']
})
export class StateFilterComponent implements OnInit {

  // Lists fetched from api
  public users;
  public appointments;
  public teams: Array<any> = [];

  // Variables decided by user
  public teamId;
  public userId;
  public currentDate;
  public dateString;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.getUsers();
    this.getDate(undefined);
    this.getAppointments();
  }

  form = new FormGroup({
    dropdown: new FormControl('', Validators.required)
  });

  public applyTeam(item) {
    var team: string = item.target.value;

    function teamIdSearch(team, array) {
      var value = '';
      array.forEach(element => {
        if (element.teamName == team)
          value = element.teamId;
      });
      return value;
    }

    this.teamId = teamIdSearch(team, this.teams)
    this.updateFilters();
  }

  public applyUser(item) {
    var user: string = item.target.value;
    var index = this.users.findIndex(i => i.name == user)
    if (index == -1)
      this.userId = '';
    else 
      this.userId = this.users[index].id;
    this.updateFilters();
  }

  public applyDate(item) {
    this.getDate(item.target.value);
    this.updateFilters();
  }

  private getUsers() {
    this.users = this.api.query('users').subscribe(Response =>
      this.users = Response)
  }

  private getDate(date) {
    // if undefined or empty set to current date
    if (date == undefined || date == '')
      this.currentDate = new Date();
    else {
      this.currentDate = new Date(date);
    }
    this.dateString = this.currentDate.getFullYear() + '-'
      + (this.currentDate.getMonth() + 1) + '-'
      + this.currentDate.getUTCDate();
  }

  public formatDate(val) {
    //NOTE: To ensure the locale and timezone match, can
    //alternately set the timeZone in the options to UTC.
    return val.toLocaleDateString("en-US"
      , { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  public getAppointments(){
    this.api.query('appointments').subscribe(Response => {
      this.appointments = Response;

      if (this.teams.length == 0) {
        var tempSet: Set<String> = new Set();
        function team(id, name) {
          this.teamId = id;
          this.teamName = name;
        }
        this.appointments.forEach(element => {
          var temp = new team(element.teamId, element.teamName);
          temp = JSON.stringify(temp)
          if (tempSet.has(temp) == false) {
            tempSet.add(temp);
            this.teams.push(JSON.parse(temp));
          }
        });
      }
    })
  }

  public updateFilters() {
    // /apps/api/test/filters/?teamId=(teamID)&pickOwner=(userID)&pickDay=(today)

    this.api.stateQuery(this.teamId, this.userId, 
      this.dateString)
    .subscribe()
  }
}
