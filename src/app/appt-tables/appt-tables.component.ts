import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApiService } from '../api.service';

/*
For reference, meeting objects are in the following form:
array = [{
  apptType: string;
  condition: string;
  contactId: string;
  contactName: string;
  gradExpected: string;
  honors: string;
  id: string;
  interactionCreatedOn: string;
  interactionId: string;
  interactionOwnerName: string;
  interactionState: string;
  major: string;
  name: string;
  notes: string;
  ownerId: string;
  ownerName: string;
  preprof: string;
  reasons: string;
  startOn: string;
  subject: string;
  teamId: string;
  teamName: string;
  time: string; }]
*/

@Component({
  selector: 'app-appt-tables',
  templateUrl: './appt-tables.component.html',
  styleUrls: ['./appt-tables.component.css']
})
export class ApptTablesComponent implements OnInit {

  @Output() toggleDetail = new EventEmitter();
  @Output() toggleRecord = new EventEmitter();
  isDataAvailable:boolean = false;

  // List of all column names for html to load
  columnNames = [
    {id: 1, label: 'Time'}, {id: 2, label: 'Student'},
    {id: 3, label: 'Here to See'}, {id: 4, label: 'On Team'},
    {id: 5, label: 'Meeting With'}, {id: 6, label: 'Subject'},
    {id: 7, label: 'Status'}
  ]

  // All possible conditiones of meetings
  meetingConditions = [
    {id: 0, label: 'Reset', condition: 'Scheduled'}, {id: 1, label: 'Check-In', condition: 'Checked In'},
    {id: 2, label: 'Begin', condition: 'Active'}, {id: 3, label: 'Finish', condition: 'Finished'},
    {id: 4, label: 'Cancel', condition: 'Canceled'}, {id: 5, label: 'No-show', condition: 'No-show'},
  ];

  // List of possible entries-visible limiters
  entries = [5, 10, 25, 50, 100];

  // List of arrays the tables use to know the total appointments in each
  queues;
  actives;
  completeds;

  /**
   *  Labels for each of the 3 tables
   * => index represents which table is being referred to in each array (used frequently as function arg)
   * => source is the array being displayed on each table
   * => start is the start index+1 in the array being displayed
   * => end is the end index+1 in the array being displayled
   * => total is the size of id's respective array aka # of meetings with specific conditions
   * => page is the current page
   * => totalPages is the # of pages needed to display all of the meetings based on range
   * => range is the # of meetings being displayed per each table's select menu
   * 
   * Note that many of the functions use the index to access different tables based on what is being interacted with.
   * 0 is for the appointments in the queue table => queues
   * 1 is for the appointments in the in progress table => actives
   * 2 is for the appointments in the completeds table => completeds
   * 
   * Also note that previous_input will hold what the input was before its latest change, 
   * this is how we verify what type of change has been made so we can be a little more efficient - see filter function.
   * */
  tables = [
    {index: 0, name: 'Appointments Queue', id: 'queues', source: [], start: 1, end: 5, total: 0, page: 1, totalPages: 0, range: 25, previous_input: ''},
    {index: 1, name: 'Appointments In Progress', id: 'actives', source: [], start: 1, end: 5, total: 0, page: 1, totalPages: 0, range: 25, previous_input: ''},
    {index: 2, name: 'Appointments Completed', id: 'completeds', source: [], start: 1, end: 5, total: 0, page: 1, totalPages: 0, range: 25, previous_input: ''},
  ];

  /**
   * Condition Options:
   * Queue: Scheduled (Reset), Checked In (Check-In)
   * In Progress: Active (Begin)
   * Completed: Finished (Finish), Canceled (Cancel), No show (No-show)
   */
  appointments: any;

  constructor(private api: ApiService) { }

  // General etiquite is initializing all variables in NgOnInit vs in constructor 
  ngOnInit() {
    this.getAppointments();
  }

  // Triggers emitter to send data to parent to toggle the quickview page with the correct user's information
  openQuickView(meeting) {
    this.api.saveUserInformation(meeting);
    this.toggleDetail.emit();
  }

  openRecordView(meeting): void {
    this.api.saveUserInformation((meeting));
    this.toggleRecord.emit();
  }

  // API call to server for list of all appointments - when received, we sort them into respective arrays aka tables
  getAppointments() {
    this.api.query('appointments').subscribe(data => {
      // since we don't know if they're going to be given to us sorted, we will do it (can remove later if they do come sorted by time)
      this.appointments = this.sort(data); 
      let params = this.api.getParams();

      if(params) {
        this.updateCurrentState(params);
      } else {
        this.initializeAllArrays();
      }
    });
  }

  // Updates all tables based on appointments table
  public initializeAllArrays() {
    this.queues = this.refilter(0);
    this.actives = this.refilter(1);
    this.completeds = this.refilter(2);
    this.updateTablePagesInfo(0);
    this.updateTablePagesInfo(1);
    this.updateTablePagesInfo(2);
  }

  /**
   * Updates the entries to be displayed in respective table
   * @param table which table (int)
   */
  setDisplayArray(table) {
    if(table == 0 || table == 'queues') {
      this.tables[0].source = this.queues.slice(this.tables[0].start-1, this.tables[0].end);
    } else if(table == 1 || table == 'actives') {
      this.tables[1].source = this.actives.slice(this.tables[1].start-1, this.tables[1].end);
    } else if(table == 2 || table == 'completeds') {
      this.tables[2].source = this.completeds.slice(this.tables[2].start-1, this.tables[2].end);
    }
  }

  /**
   * Checks if the condition matches the table being filled in the html and returns true or false accordingly
   * @param table which table (int)
   * @param condition the status of the meeting
   */
  checkCondition(table, condition) {
    if(((table == 'queues') && (condition == 'Scheduled' || condition == 'Checked In')) || ((table == 'actives') && (condition == 'Active')) || ((table == 'completeds') && (condition == 'Finished' || condition == 'Canceled' || condition == 'No-show'))) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * For pagination of tables, updates the values for functionality
   * @param which which table (int)
   */
  updateTablePagesInfo(table) {
    // # entries total
    if(table == 0) {
      this.tables[table].total = this.queues.length;
    } else if(table == 1) {
      this.tables[table].total = this.actives.length;
    } else if(table == 2) {
      this.tables[table].total = this.completeds.length;
    }

    // # pages total
    this.tables[table].totalPages = Math.round(this.tables[table].total / this.tables[table].range);
    if((this.tables[table].total / this.tables[table].range) > this.tables[table].totalPages) {
      this.tables[table].totalPages += 1;
    } 

    // last entry being displayed
    if(this.tables[table].end > this.tables[table].total) {
      this.tables[table].end = this.tables[table].total;
    }

    // current page
    this.tables[table].page = 1;
    if(this.tables[table].total == 0) {
      this.tables[table].page = 0;
    } 

    // first entry being displayed
    this.tables[table].start = 1;
    if(this.tables[table].range > this.tables[table].total) {
      this.tables[table].end = this.tables[table].total;
    } else {
      this.tables[table].end = this.tables[table].range;
    }

    if(this.tables[table].end == 0) {
      this.tables[table].start = 0;
    } 

    this.setDisplayArray(table);
  }

  /**
   * changes the look and text of filter type button
   * @param thing the event of changing the button
   * @param table which table (string)
   * @param which which table (int)
   */
  public filterType(thing, table, which) {
    let element = document.getElementById(table + 'FilterButton');

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
    this.filter(thing, which, table);
  }

  /**
   * Note: this should be an AJAX call to the server, this is just for client implementation
   * Updates condition of meeting and removes it from current array, then adds it to the correct array.
   * Then we have to refilter the table the meeting was moved to (if it did move tables)
   * @param which the condition selected
   * @param meeting the meeting object being referenced
   * @param table which table (int)
   */
  public updateCondition(which, meeting, table) {
    let index = this.appointments.indexOf(meeting);
    let oldcondition = meeting.condition;

    this.api.post('update_condition', {"id": meeting.id.toString(), "condition": which.condition.toString()}).subscribe( data => {
      // TODO add error handling
    });

    // set meeting's condition as new condition
    meeting.condition = which.condition;
    // set the meeting in appointment's array as the updated meeting 
    this.appointments[index] = meeting;

    if(this.checkIfUpdateNeeded(oldcondition, meeting.condition)) {
      this.add(meeting.condition, meeting);
      this.remove(oldcondition, meeting);

      // update based on table
      this.updateTablePagesInfo(table);
    }
    // we have to identify the new table (both int and name) to refilter results shown
    let temp, temp2;
    if(meeting.condition == 'Scheduled' || meeting.condition == 'Checked In') {
      temp = 0;
      temp2 = 'queues';
    } else if (meeting.condition == 'Active') {
      temp = 1;
      temp2 = 'actives';
    } else {
      temp = 2;
      temp2 = 'completeds';
    }
    this.filter(temp, temp, temp2);
  }

  /**
   * Decide if tables need to be updated or if condition change is only thing needed
   * Note: this may not be needed - depends on server's interaction
   * @param oldCondition current condition
   * @param newCondition condition to change current one to
   */
  private checkIfUpdateNeeded(oldCondition, newCondition) {
    if((oldCondition == 'Scheduled' || oldCondition == 'Checked In') && (newCondition == 'Scheduled' || newCondition == 'Checked In')) {
      return false;
    } else if ((oldCondition == 'Finished' || oldCondition == 'No-show' || oldCondition == 'Canceled') && (newCondition == 'Finished' || newCondition == 'No-show' || newCondition == 'Canceled')) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Adds object to specific array based on input string and condition
   * Note: this may not be needed - depends on server's interaction
   * @param condition meeting condition
   * @param obj meeting object being referenced
   */
  public add(condition, obj) {
    if(condition == 'Scheduled' || condition == 'Checked In') {
      this.queues.push(obj);
      this.queues = this.sort(this.queues);
      this.updateTablePagesInfo(0);
    } else if(condition == 'Active') {
      this.actives.push(obj);
      this.actives = this.sort(this.actives);
      this.updateTablePagesInfo(1);
    } else {
      this.completeds.push(obj);
      this.completeds = this.sort(this.completeds);
      this.updateTablePagesInfo(2);
    }
  }

  /**
   * Sorts array of objets (appointments) based on time value (earliest first)
   * @param array array of objects (appointments) to be sorted
   */
  sort(array) {
    return array.sort((a,b) => a.time.localeCompare(b.time));
  }

  /**
   * Removes object from specific array based on input string and condition
   * Note: this may not be needed - depends on server's interaction
   * @param condition meeting condition
   * @param obj meeting object being referenced
   */
  public remove(condition, obj) {
    if(condition == 'Scheduled' || condition == 'Checked In') {
      let index = this.queues.indexOf(obj);
      this.queues.splice(index, 1);
    } else if(condition == 'Active') {
      let index = this.actives.indexOf(obj);
      this.actives.splice(index, 1);
    } else {
      let index = this.completeds.indexOf(obj);
      this.completeds.splice(index, 1);
    }
  }

  /**
   * Returns array for table based on input string
   * @param table which table (int)
   */
  public refilter(table) {
    if(table == 0) {
      return this.appointments.filter(data => data.condition == 'Scheduled' || data.condition == 'Checked In');
    } else if(table == 1) {
      return this.appointments.filter(data => data.condition == 'Active');
    } else if(table == 2) {
      return this.appointments.filter(data => data.condition == 'Finished' || data.condition == 'Canceled' || data.condition == 'No-show');
    }
  }

  /**
   * Filters specific tables based on input string - calls which function
   * @param thing the input event object from HTML
   * @param table which table (int)
   * @param tableName which table is being interacted with 
   */
  public filter(thing, table, tableName) {
    let button = document.getElementById(tableName + "FilterButton");
    let input = (<HTMLInputElement>document.getElementById(tableName + "FilterInput")).value;

    // Filter set to Matching Any
    if(button.innerHTML == 'Matching Any') {
      this.filterMA(thing, table, input);
    // Filter set to Requiring All
    } else if(button.innerHTML == 'Requiring All') {
      this.filterRA(thing, table, input);
    // Filter set to Match Exact
    } else {
      this.filterME(thing, table, input);
    }
  }

  /**
   * Filters specific tables based on input string - Match Exact
   * Example: input => "foo bar" => return results containing "foo bar", exactly as input
   * @param thing the input event object from HTML => used to determine how the input has changed
   * @param table which table (int) => used to determine which table the user is interacting with
   * @param input the value currently in input (filter) field => full string of user's input 
   */
  public filterME(thing, table, input) {
    // status of meeting is changed to this table so we have to re-filter it
    if(typeof thing == 'number') {
      let temp = this.filterByValue(this.refilter(table), input);
      if(table == 0) {
        this.queues = temp;
      } else if (table == 1) {
        this.actives = temp;
      } else if (table == 2) {
        this.completeds = temp;
      }

    // usually indicates 'delete' so we need to refilter based on remaining input
    } else if(thing.data == null) {
      // input not empty, filter on input
      if(input != '') {
        let temp = this.filterByValue(this.refilter(table), input);
        if(table == 0) {
          this.queues = temp;
        } else if (table == 1) {
          this.actives = temp;
        } else if (table == 2) {
          this.completeds = temp;
        }
      } else {
        if(table == 0) {
          this.queues = this.refilter(table);
        } else if (table == 1) {
          this.actives = this.refilter(table);
        } else if (table == 2) {
          this.completeds = this.refilter(table);
        }
      }
    // indicates a new character was added so filter based on the new character of existing filtered array
    } else {
      this.callME(table, input);
    }

    this.updateTablePagesInfo(table);
  }

  /**
   * A middle-man function to properly call the function to filter the function - Match Exact
   * @param table which table (int) => used to determine which table the user is interacting with
   * @param input the value currently in input (filter) field => full string of user's input 
   * @param type int value to tell us how the user interacted with the filter => changes the array we fill feed into the RA filter function
   *             1: refilters on all appointments of that table 
   *             2: refilters on subset of appointments already filtered
   */
  private callME(table, input) {
    let temp, type;

    // if the previous input is one less than the length of current input we can filter on what we've already filtered
    if((this.tables[table].previous_input.toString().length+1 == input.toString().length)) {
      type = 2;
    // else we have to filter on all appointments of this table type
    } else {
      type = 1;
    }
    this.tables[table].previous_input = input;

    if(table == 0) {
      if(type == 1) {
        temp = this.filterByValue(this.refilter(table), input);
      } else if(type == 2) {
        temp = this.filterByValue(this.queues, input);
      }
      this.queues = this.sort(temp);
    }
    else if(table == 1) {
      if(type == 1) {
        temp = this.filterByValue(this.refilter(table), input);
      } else if(type == 2) {
        temp = this.filterByValue(this.actives, input);
      }
      this.actives = this.sort(temp);
    }
    else if(table == 2) {
      if(type == 1) {
        temp = this.filterByValue(this.refilter(table), input);
      } else if(type == 2) {
        temp = this.filterByValue(this.completeds, input);
      }
      this.completeds = this.sort(temp);
    }
  }

  /**
   * Filters specific tables based on input string - Requiring All
   * Example: input => "foo bar" => return results containing "foo" OR "bar" - nonexclusive
   * @param thing the input event object from HTML => used to determine how the input has changed
   * @param table which table (int) => used to determine which table the user is interacting with
   * @param input the value currently in input (filter) field => full string of user's input 
   */
  public filterRA(thing, table, input) {
    let temp = input.split(" ").filter(o => o);
    input = temp;
    // status of meeting is changed to this table so we have to re-filter it
    if(typeof thing == 'number') {
      // if input isn't empty
      if(input.length > 0) {
        this.callRA(table, input, 2);
      } else {
        if(table == 0) {
          this.queues = this.refilter(table);
        } else if (table == 1) {
          this.actives = this.refilter(table);
        } else if (table == 2) {
          this.completeds = this.refilter(table);
        }
      }
    // usually indicates 'delete' so we need to refilter based on remaining input
    } else if(thing.data == null) {
      // if input isn't empty
      if(input.length > 0) {
        this.callRA(table, input, 1);
      } else {
        if(table == 0) {
          this.queues = this.refilter(table);
        } else if (table == 1) {
          this.actives = this.refilter(table);
        } else if (table == 2) {
          this.completeds = this.refilter(table);
        }
      }
    // indicates a new character was added so filter based on the new character of existing filtered array
    } else {
      // if the previous input is 1 character less than current input length, filter by what we've already filtered + the new character
      if(this.tables[table].previous_input.toString().length+1 == input.toString().length) {
        this.tables[table].previous_input = input;
        this.callRA(table, input, 2);
      // else we have to filter on all appointments of this table type
      } else {
        this.tables[table].previous_input = input;
        this.callRA(table, input, 1);
      }
    }

    this.updateTablePagesInfo(table);
  }

  /**
   * A middle-man function to properly call the function to filter the function - Requiring All
   * @param table which table (int) => used to determine which table the user is interacting with
   * @param input the value currently in input (filter) field => full string of user's input 
   * @param type int value to tell us how the user interacted with the filter => changes the array we fill feed into the RA filter function
   *             1: refilters on all appointments of that table 
   *             2: refilters on subset of appointments already filtered
   */
  private callRA(table, input, type) {
    let temp;
    if(table == 0) {
      if(type == 1) {
        temp = this.requiringAll(this.refilter(table), input);
      } else if(type == 2) {
        temp = this.requiringAll(this.queues, input);
      }
      this.queues = this.sort(temp);
    }
    else if(table == 1) {
      if(type == 1) {
        temp = this.requiringAll(this.refilter(table), input);
      } else if(type == 2) {
        temp = this.requiringAll(this.actives, input);
      }
      this.actives = this.sort(temp);
    }
    else if(table == 2) {
      if(type == 1) {
        temp = this.requiringAll(this.refilter(table), input);
      } else if(type == 2) {
        temp = this.requiringAll(this.completeds, input);
      }
      this.completeds = this.sort(temp);
    }
  }

  /**
   * Filters specific tables based on input string - Matching Any
   * Example: input => "foo bar" => return results containing "foo" and "bar"
   * @param thing the input event object from HTML => used to determine how the input has changed
   * @param table which table (int) => used to determine which table the user is interacting with
   * @param input the value currently in input (filter) field => full string of user's input 
   */
  public filterMA(thing, table, input) {
    let temp = input.split(" ").filter(o => o);
    input = temp;
    // status of meeting is changed to this table so we have to re-filter it
    if(typeof thing == 'number') {
      this.callMA(table, input);
    // usually indicates 'delete' so we need to refilter based on remaining input
    } else if(thing.data == null) {
      if(input.length > 0) {
        this.callMA(table, input);
      } else {
        if(table == 0) {
          this.queues = this.refilter(table);
        } else if (table == 1) {
          this.actives = this.refilter(table);
        } else if (table == 2) {
          this.completeds = this.refilter(table);
        }
      }
    // indicates a new character was added so filter based on the new character of existing filtered array
    } else {
      this.callMA(table, input);
    }

    // set prev_input for other filter types
    this.tables[table].previous_input = input;

    this.updateTablePagesInfo(table);
  }

    /**
   * A middle-man function to properly call the function to filter the function - Matching Any
   * @param table which table (int) => used to determine which table the user is interacting with
   * @param input the value currently in input (filter) field => full string of user's input 
   * @param type int value to tell us how the user interacted with the filter => changes the array we fill feed into the MA filter function
   */
  private callMA(table, input) {
    let temp;
    temp = this.matchingAny(table, input);
    if(table == 0) {
      this.queues = this.sort(temp);
    }
    else if(table == 1) {
      this.actives = this.sort(temp);
    }
    else if(table == 2) {
      this.completeds = this.sort(temp);
    }
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
 * Logic to filter based on the words delimited by spaces - Matching Any
 * @param which which table (int) => used to determine which table the user is interacting with
 * @param input space delimited filter we are searching the appointments by
 */
  private matchingAny(which, input) {
    let table = this.refilter(which);
    let matches = [];
    // Note: foreach doesn't allow us to 'break' from it but it still seems like the best option
    input.forEach(element => {
      let temp = this.filterByValue(table, element);
      temp.forEach(o => {
        // need some way to check if object already exists in array so we don't have duplicates
        if(!(matches.some( ({id}) => id === o.id))) {
          // add matching values to final array
          matches.push(o);
          // remove matching values from further matches (already matches at least 1)
          table = table.filter(function(el) { return el.id != o.id})
        } 
      });
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
   * Updates array based on table's select menu
   * @param max new entries displayed value
   * @param table which table (int)
   */
  changeRange(max: number, table) {
    this.tables[table].range = Number(max);
    this.updateTablePagesInfo(table);
  }

  /**
   * Calculates the proper indexes of pages being shown for table
   * @param table which table (int)
   */
  nextPage(table) {
    if(this.tables[table].page == this.tables[table].totalPages) {
      return;
    }
    this.tables[table].start = this.tables[table].end + 1;
    this.tables[table].end = this.tables[table].end + this.tables[table].range;
    if(this.tables[table].end > this.tables[table].total) {
      this.tables[table].end = this.tables[table].total;
    }
    this.tables[table].page += 1;
    this.setDisplayArray(table);
  }

  /**
   * Calculates the proper indexes of pages being shown for table
   * @param table which table (int)
   */
  prevPage(table) {
    if(this.tables[table].page <= 1) {
      return;
    }
    this.tables[table].start = this.tables[table].start - this.tables[table].range;
    if(this.tables[table].start <= 0) {
      this.tables[table].start = 1;
    }
    if(this.tables[table].page == this.tables[table].totalPages) {
      this.tables[table].end = this.tables[table].end - (this.tables[table].total % this.tables[table].range);
    } else {
      this.tables[table].end = this.tables[table].end - this.tables[table].range;
    }

    if(this.tables[table].end > this.tables[table].range) {
      this.tables[table].end = this.tables[table].range;
    }
    this.tables[table].page -= 1;

    this.setDisplayArray(table);
  }

  private updateTables(update, table) {
    let temp;
    if(table != -1) {
      temp = this.refilter(table);
    } else {
      temp = this.appointments;  
    }
    if (update.userId != '')
      temp = temp.filter(data => data.ownerId == update.userId);
    if (update.teamId != '')
      temp = temp.filter(data => data.teamId == update.teamId);
    if (temp.length != 0)
      temp = temp.filter(data => data.startOn.slice(0,10) == update.date)
    return temp;
  }

  public updateCurrentState($event) {
    console.log($event.date);
    this.appointments = this.updateTables($event, -1);
    this.queues = this.updateTables($event, 0);
    this.actives = this.updateTables($event, 1);
    this.completeds = this.updateTables($event, 2);
    this.updateTablePagesInfo(0);
    this.updateTablePagesInfo(1);
    this.updateTablePagesInfo(2);
  }
}
