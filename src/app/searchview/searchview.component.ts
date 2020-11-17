import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-searchview',
  templateUrl: './searchview.component.html',
  styleUrls: ['./searchview.component.css']
})
export class SearchviewComponent implements OnInit {
  constructor(private api: ApiService) { }

  ngOnInit() { }

  formFields = {
    firstName: '',
    lastName: '',
    email: '',
    number: null,
    date: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
    hour: '12', 
    minute: '00',
    period: 'PM',
    duration: '30',
    assignedTo: ''
  }

  // Array for picking times and duration
  hours = Array.from({length: 12}, (_, i) => i + 1);
  defaultHour = 12;
  minutes = ['00', '05', 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  periods = ['AM', 'PM'];

  // List of users from API call (master list)
  public allUsers;
  totalEntries = 0;

  // Potentially filtered list of users
  public users;

  // List of potential assignees for drop-in appointments
  assignees;

  // List of names for columns
  columnNames = [
    {index: 0, label: 'Link'},
    {index: 1, label: 'Name'},
    {index: 2, label: 'Odin/Email'},
    {index: 3, label: 'Phone'},
  ]

  // List of possible entries-visible limiters
  entries = [5, 10, 25, 50, 100];

  // Current range value => default 50
  range = 50;

  // Variables for pagination
  total = 0;
  totalPages = 0;
  start = 1;
  end = 5;
  page = 0;

  // Array for items being displayed 
  source = [];

  // Boolean for whether results (users array) will be shown or not
  queried = false;

  /**
   * Sets default fields for form when modal is closed, submitted, and first opened
   */
  public setFormFields(): void {
    this.formFields = {
      firstName: '',
      lastName: '',
      email: '',
      number: null,
      date: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      hour: '12', 
      minute: '00',
      period: 'PM',
      duration: '30',
      assignedTo: this.assignees[0].name
    }
  }

  /**
   * Calculates the end time of the appointments based on the input start time and duration
   * from drop-in form
   */
  private calculateEndTime() {
    let duration = Number(this.formFields.duration);
    let plusHours = Math.floor(duration / 60);
    let plusMinutes = duration % 60;
    if (plusHours < 1) {
      plusHours = 0;
    } 

    let endM = Number(this.formFields.minute);
    let endH = Number(this.formFields.hour);
    
    endM += plusMinutes;

    if(endM >= 60) {
      endH += Math.floor(endM / 60);
      endM = endM % 60;
    }
    endH += plusHours;
    if(Number(this.formFields.hour) < 12 && endH >= 12) {
      if(this.formFields.period == 'AM') {
        this.formFields.period = 'PM';
      } else if(this.formFields.period == 'PM') {
        this.formFields.period = 'AM';
      }
    }
    if(endH > 12) {
      endH = endH % 12;
    }

    return (endH.toString() + ':' + endM.toString() + ' ' + this.formFields.period);
  }

  /**
   * Makes API call to create drop-in appointment
   * TODO show user that form is being submitted
   */
  createDropIn() {
    if(this.formFields.firstName != '' && this.formFields.lastName != '' && this.formFields.email != '') {
      let body = {
        contactName: this.formFields.firstName + this.formFields.lastName,
        interactionCreatedOn: this.formFields.date,
        ownerName: this.formFields.assignedTo,
        time: this.formFields.hour + ':' + this.formFields.minute + ' ' + this.formFields.period + ' - ' + this.calculateEndTime(),
        name: this.formFields.firstName,
        condition: "Scheduled",
        apptType: "scheduled"
      }

      // indicate to user form is being submitted
      document.getElementById('submitting').hidden = false;
      document.getElementById('submitButton').hidden = true;

      // TODO implement api post call to create dropin appointment 
      this.api.post('add_dropin', body).subscribe( data => {
        // TODO error handling on API return value
        this.setFormFields();

        // hide form is being submitted indication
        document.getElementById('closeModal').click();
        document.getElementById('submitting').hidden = true;
        document.getElementById('submitButton').hidden = false;
      });
    } else {
      // TODO create error message to indicate form could not be submitted
    }
  }

  /**
   * Returns true if id starts with 9 aka a valid PSU ID
   * @param id value of user id
   */
  validId(id) {
    if(id) {
      if(id.charAt(0) == '9') {
        return true;
      }
    } 
    return false;
  }

  /**
   * Grabs the input and makes API call using it
   */
  searchUsers() {
    let value = (<HTMLInputElement>document.getElementById('searchInput')).value.toString();
    // TODO USE INPUT IN API SEARCH CALL
    this.api.post('search?name='+value, {"name": value, "email": value, "id": value}).subscribe(Response => {
      // TODO remove this and use the commented line below it - this is just for demo purposes since I can't get API call to work
      this.allUsers = this.filterByValue(Response, value);
      // this.allUsers = Response;
      this.totalEntries = this.allUsers.length;
      this.users = this.allUsers;
      this.updateTablePagesInfo();
      this.isQueried();
    });
    this.api.query('users').subscribe(Response => {
      // TODO error check response before this
      this.assignees = Response;
      this.formFields.assignedTo = this.assignees[0].name;
    });
  }

  /**
   * changes the look and text of filter type button
   */
  public filterType() {
    let element = document.getElementById('searchType');

    // Matching Any --> Match Exact
    if(element.innerHTML == "Matching Any") {
      element.innerHTML = "Match Exact";
      element.className = "btn btn-dark";
    // Requiring All --> Matching Any
    } else if(element.innerHTML == "Requiring All") {
      element.innerHTML = "Matching Any";
      element.className = "btn btn-light";
    // Match Exact --> Requiring All
    } else {
      element.innerHTML = "Requiring All";
      element.className = "btn btn-success";
    }
    this.filter();
  }

  /**
   * Filters the users returned based on input
   */
  filter() {
    let input = (<HTMLInputElement>document.getElementById("searchFilterInput")).value;
    if(input.split(' ').length == 1 && input[0] == "") {
      this.users = this.allUsers;
    } else {
      let element = document.getElementById('searchType').innerHTML;
      if(element == "Matching Any") {
        this.users = this.matchingAny(this.allUsers, input.split(' '));
      } else if(element == "Requiring All") {
        this.users = this.requiringAll(this.allUsers, input.split(' '));
      } else { // Match Exact
        this.users = this.filterByValue(this.allUsers, input);
      }
    }

    this.updateTablePagesInfo();
  }

  /**
   * Logic to filter based on the words delimited by spaces - Matching Any
   * @param which which table (int) => used to determine which table the user is interacting with
   * @param input space delimited filter we are searching the appointments by
   */
  private matchingAny(array, input) {
    let matches = [];
    // Note: foreach doesn't allow us to 'break' from it but it still seems like the best option
    input.forEach(element => {
      let temp = this.filterByValue(array, element);
      temp.forEach(o => {
        // need some way to check if object already exists in array so we don't have duplicates
        if(!(matches.some( ({email}) => email === o.email))) {
          // add matching values to final array
          matches.push(o);
          // remove matching values from further matches (already matches at least 1)
          array = array.filter(function(el) { return el.email != o.email})
        } 
      });
    });
    return matches;
  }

    /**
   * Logic to filter based on the words delimited by spaces - Requiring All
   * @param table the array displayed on the table that we are searching from
   * @param input space delimited filter we are searching the appointments by
   */
  private requiringAll(table, input) {
    let matches = [];
    // Note: foreach doesn't allow us to 'break' from it but it still seems like the best option
    input.forEach(element => {
      if(element == input[0]) {
        var temp = this.filterByValue(table, element);
      } else {
        var temp = this.filterByValue(matches, element);
      }
      matches = temp;
    });
    return matches;
  }

  /**
   * Searches array of objects for substring within all fields
   * @param array which array we're changing
   * @param string the string we're searching for (in array)
   */
  private filterByValue(array, string) {
    return array.filter(o =>
      Object.keys(o).some(k => 
        o[k].toString().toLowerCase().includes(string.toLowerCase())
      )
    );
  }

  /**
   * Flips queried's bool value and returns it
   */
  private isQueried() {
    this.queried = !this.queried;
    return this.queried;
  }

  /**
   * For pagination of table, updates the values for functionality
   */
  updateTablePagesInfo() {
    // # entries total
    this.total = this.users.length;

    // # pages total
    this.totalPages = Math.round(this.total / this.range);
    if((this.total / this.range) > this.totalPages) {
      this.totalPages += 1;
    } 

    // last entry being displayed
    if(this.end > this.total) {
      this.end = this.total;
    }

    // current page
    this.page = 1;
    if(this.total == 0) {
      this.page = 0;
    } 

    // first entry being displayed
    this.start = 1;
    if(this.range > this.total) {
      this.end = this.total;
    } else {
      this.end = this.range;
    }

    if(this.end == 0) {
      this.start = 0;
    } 

    this.setDisplayArray();
  }

  /**
   * Updates the entries to be displayed in table
   */
  setDisplayArray() {
    this.source = this.users.slice(this.start-1, this.end);
  }

  /**
   * Updates array based on table's select menu
   * @param max new entries displayed value
   * @param table which table (int)
   */
  changeRange(max: number) {
    this.range = Number(max);
    this.updateTablePagesInfo();
  }

  /**
   * Calculates the proper indexes of pages being shown for table
   */
  nextPage() {
    if(this.page == this.totalPages) {
      return;
    }
    this.start = this.end + 1;
    this.end = this.end + this.range;
    if(this.end > this.total) {
      this.end = this.total;
    }
    this.page += 1;
    this.setDisplayArray();
  }

  /**
   * Calculates the proper indexes of pages being shown for table
   */
  prevPage() {
    if(this.page <= 1) {
      return;
    }
    this.start = this.start - this.range;
    if(this.start <= 0) {
      this.start = 1;
    }
    if(this.page == this.totalPages) {
      this.end = this.end - (this.total % this.range);
    } else {
      this.end = this.end - this.range;
    }

    if(this.end > this.range) {
      this.end = this.range;
    }
    this.page -= 1;

    this.setDisplayArray();
  }

}
