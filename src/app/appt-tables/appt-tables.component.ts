import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Appointment {
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
  time: string;
}

@Component({
  selector: 'app-appt-tables',
  templateUrl: './appt-tables.component.html',
  styleUrls: ['./appt-tables.component.css']
})
export class ApptTablesComponent implements OnInit {

  isDataAvailable:boolean = false;

  columnNames = [
    {id: 1, label: 'Time'}, {id: 2, label: 'Student'},
    {id: 3, label: 'Here to See'}, {id: 4, label: 'On Team'},
    {id: 5, label: 'Meeting With'}, {id: 6, label: 'Subject'},
    {id: 7, label: 'Condition'}
  ]

  // All possible conditiones of meetings
  meetingConditions = [
    {id: 0, label: 'Reset', condition: 'Scheduled'}, {id: 1, label: 'Check-In', condition: 'Checked In'},
    {id: 2, label: 'Begin', condition: 'Active'}, {id: 3, label: 'Finish', condition: 'Finished'},
    {id: 4, label: 'Cancel', condition: 'Canceled'}, {id: 5, label: 'No-show', condition: 'No show'},
  ];

  // List of possible entries-visible limiters
  entries = [5, 10, 25, 50, 100];

  // Variables to control which meetings are being displayed on each table (pagination)
  // Note: default is 5 entries displayed

  // List of arrays the tables use to know the total appointments in each
  queues;
  actives;
  completeds;

  // Strings that contain our substring for each table that we're filtering for
  queuesFilter = '';
  activesFilter = '';
  completedsFilter = '';

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
   * */
  tables = [
    {index: 0, name: 'Appointments Queue', id: 'queues', source: [], start: 1, end: 5, total: 0, page: 1, totalPages: 0, range: 5},
    {index: 1, name: 'Appointments In Progress', id: 'actives', source: [], start: 1, end: 5, total: 0, page: 1, totalPages: 0, range: 5},
    {index: 2, name: 'Appointments Completed', id: 'completeds', source: [], start: 1, end: 5, total: 0, page: 1, totalPages: 0, range: 5},
  ];

  /**
   * Condition Options:
   * Queue: Scheduled (Reset), Checked In (Check-In)
   * In Progress: Active (Begin)
   * Completed: Finished (Finish), Canceled (Cancel), No show (No-show)
   */
  appointments: any;

  constructor(private http: HttpClient) { }

  // General etiquite is initializing all variables onInit vs in constructor 
  ngOnInit() {
    this.getAppointments();
  }

  // API call to server for list of all appointments - when received, we sort them into respective arrays aka tables
  getAppointments() {
    return this.http.get('http://localhost:6543/apps/api/test/appointments').subscribe(data => {
      // since we don't know if they're going to be given to us sorted, we will do it (can remove later if they do come sorted by time)
      this.appointments = this.sort(data); 
      console.log(this.appointments);
      this.initializeAllArrays();
    });
  }

  // Updates all tables based on appointments table
  public initializeAllArrays() {
    this.queues = this.appointments.filter(data => data.condition == 'Scheduled' || data.condition == 'Checked In');
    this.actives = this.appointments.filter(data => data.condition == 'Active');
    this.completeds = this.appointments.filter(data => data.condition == 'Finished' || data.condition == 'Canceled' || data.condition == 'No show');
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
    if(((table == 'queues') && (condition == 'Scheduled' || condition == 'Checked In')) || ((table == 'actives') && (condition == 'Active')) || ((table == 'completeds') && condition == 'Finished' || condition == 'Canceled' || condition == 'No show')) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * For pagination of queues table, updates the values for functionality
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
   * @param table which table (string)
   * TODO change how it filters
   */
  public filterType(table) {
    let element = document.getElementById(table + 'FilterButton');
    if(element.innerHTML == "Matching Any") {
      element.innerHTML = "Requiring All";
      element.className = "btn btn-success";
    } else {
      element.innerHTML = "Matching Any";
      element.className = "btn btn-light";
    }
  }

  /**
   * Note: this should be an AJAX call to the server, this is just for client implementation
   * Updates condition of meeting and removes it from current array, then adds it to the correct array
   * @param which the condition selected
   * @param meeting the meeting object being referenced
   * @param table which table (int)
   */
  public updateCondition(which, meeting, table) {
    let index = this.appointments.indexOf(meeting);
    let oldcondition = meeting.condition;

    meeting.condition = which.condition;
    this.appointments[index] = meeting;

    if(this.checkIfUpdateNeeded(oldcondition, meeting.condition)) {
      this.add(meeting.condition, meeting);
      this.remove(oldcondition, meeting);

      // update based on table
      this.updateTablePagesInfo(table);
    }
    return;
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
    } else if ((oldCondition == 'Finished' || oldCondition == 'No show' || oldCondition == 'Canceled') && (newCondition == 'Finished' || newCondition == 'No show' || newCondition == 'Canceled')) {
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
   * Refreshes a table based on input string
   * @param table which table (int)
   */
  public refresh(table) {
    if(table == 0) {
      this.queues = this.appointments.filter(data => data.condition == 'Scheduled' || data.condition == 'Checked In');
    } else if(table == 1) {
      this.actives = this.appointments.filter(data => data.condition == 'Active');
    } else if(table == 2) {
      this.completeds = this.appointments.filter(data => data.condition == 'Finished' || data.condition == 'Canceled' || data.condition == 'No show');
    }
  }

  /**
   * Filters specific tables based on input string - Requiring All(?)
   * Matching Any implementation still needed
   * @param thing the input event object from HTML
   * @param table which table (int)
   */
  public filter(thing, table) {
    // usually indicates 'delete' so we refilter for remaining characters
    if(thing.data == null) {
      switch(table) {
        case 0: {
          this.queuesFilter = this.queuesFilter.slice(0, -1);
          if(this.queuesFilter != '') {
            let temp = this.filterByValue(this.queues, this.queuesFilter.substring(0, 1));
            for(let i = 1; i < this.queuesFilter.length; i++) {
              temp = this.filterByValue(temp, this.queuesFilter.substring(i, i+1));
            }
            this.queues = temp;
          } else {
            this.refresh(table);
          }
          break;
        }
        case 1: {
          this.activesFilter = this.activesFilter.slice(0, -1);
          if(this.activesFilter != '') {
            let temp = this.filterByValue(this.actives, this.activesFilter.substring(0, 1));
            for(let i = 1; i < this.activesFilter.length; i++) {
              temp = this.filterByValue(temp, this.activesFilter.substring(i, i+1));
            }
            this.actives = temp;
          } else {
            this.refresh(table);
          }
          break;
        }
        case 2: {
          this.completedsFilter = this.completedsFilter.slice(0, -1);
          if(this.completedsFilter != '') {
            let temp = this.filterByValue(this.completeds, this.completedsFilter.substring(0, 1));
            for(let i = 1; i < this.completedsFilter.length; i++) {
              temp = this.filterByValue(temp, this.completedsFilter.substring(i, i+1));
            }
            this.completeds = temp;
          } else {
            this.refresh(table);
          }
          break;
        }
      }
    // indicates a new character was added so filter based on the new character of existing filtered array
    } else {
      switch(table) {
        case 0: {
          this.queuesFilter = this.queuesFilter + thing.data;
          this.queues = this.filterByValue(this.queues, thing.data);
          break;
        }
        case 1: {
          this.activesFilter = this.activesFilter + thing.data;
          this.actives = this.filterByValue(this.actives, thing.data);
          break;
        }
        case 2: {
          this.completedsFilter = this.completedsFilter + thing.data;
          this.completeds = this.filterByValue(this.completeds, thing.data);
          break;
        }
      }
    }

    this.updateTablePagesInfo(table);
  }

  /**
   * Searches array of objects for substring(s) within all fields
   * @param array which array we're changing
   * @param string the string we're searching for (in array)
   */
  private filterByValue(array, string: string) {
    return array.filter(o =>
      Object.keys(o).some(k => o[k].toString().toLowerCase().includes(string.toLowerCase())));
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
   * Calculates the proper indexes of pages being shown for queues table
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
   * Calculates the proper indexes of pages being shown for queues table
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
}
