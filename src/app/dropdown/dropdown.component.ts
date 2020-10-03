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
  // TODO: get team data from API
  teams = ['Red', 'Blue', 'Green', 'White', 'Black']
  appointments;

  // Variables decided by user
  currentTeamId;
  currentUserId;
  currentDay;

  constructor(
    private api: ApiService) {}

  ngOnInit() {
    this.getUsers();
    this.refresh();
  }

  form = new FormGroup({
    dropdown: new FormControl('', Validators.required)
  });

  selectTeam(item) {
    var team = item.target.value;
    console.log(team);

    // TODO: set var currentTeam
    // How are teams defined in the api?

    this.updateFilters();
  }

  selectUser(item) {
    var user = item.target.value;
    console.log(user);

    function search(key, inputArray) {
      for (let i = 0; i < inputArray.length; i++) {
        if (inputArray[i].name == user) {
          console.log(inputArray[i])
          return inputArray[i].id;
        } 
        // if not in list, return 0
        else {
          return 0;
        }
      }
    }
    this.currentUserId = search(user, this.users)
    console.log(this.currentUserId)

    this.updateFilters();
  }

  getUsers() {
    this.users = this.api.query('users').subscribe(Response =>
      this.users = Response)
  }

  updateFilters() {
    // TODO:
    // Filter users based on team and user ID
    // /apps/api/test/filters/?teamId=(teamID)&pickOwner=(userID)&pickDay=(today)

    if (this.currentDay == undefined && this.currentTeamId == undefined)
      return

    this.api.filter(this.currentTeamId, this.currentUserId, 
      this.currentDay)
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