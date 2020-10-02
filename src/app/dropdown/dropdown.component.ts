import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit {
  users;
  teams;
  current_user;
  appointments;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getUsers();
    this.refresh();

    // TODO: get team data from API
    // Unsure which call to get team data from

    var test_data = ['Red', 'Blue', 'Green', 'White', 'Black']
    this.teams = test_data;
  }

  form = new FormGroup({
    list: new FormControl('', Validators.required)
  });

  selectTeam(item) {
    console.log(item.target.value);
    this.getUsers();
    
    // TODO: ser var currentTeam
    // Filter users based on team and user ID
    // /apps/api/test/filters/?teamId=(teamID)&pickOwner=(userID)&pickDay=(today)
  }

  selectUser(item) {
    console.log(item.target.value);

    // TODO: set var currentUser
    // Filter users based on team and user ID
    // /apps/api/test/filters/?teamId=(teamID)&pickOwner=(userID)&pickDay=(today)
  }

  getUsers() {
    this.http.get('http://localhost:6543/apps/api/test/users')
    .subscribe(Response => {
      this.users = Response;
      for (var i = 0; i < this.users.length; i++)
        this.users[i] = this.users[i].name
      console.log(this.users)
    });
  }

  getFilters() {
    this.http.get('http://localhost:6543/apps/api/test/users')
    .subscribe(Response => {
      this.users = Response;
    });
  }

  refresh(){
    this.http.get('http://localhost:6543/apps/api/test/appointments')
    .subscribe(Response => {
      this.appointments = Response;
    })
  }
}