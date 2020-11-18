import {
  Component,
  OnInit,
  EventEmitter,
  Output
} from '@angular/core';

import {
  ApiService
} from '../api.service';

@Component({
  selector: 'app-appt-records',
  templateUrl: './appt-records.component.html',
  styleUrls: ['./appt-records.component.css']
})
export class ApptRecordsComponent implements OnInit {

  @Output() toggleRecord = new EventEmitter();

  isPhoto = false;
  recordData;
  createInformation;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.recordData = this.apiService.getInformation();
    // console.log(this.recordData); // for debugging
  }
  myField = {
    subject: '',
    medium: '',
    createAppt: '',
    assign: ''
  }
  closeRecordView(): void {
    this.toggleRecord.emit();
  }

  createInfo(info: any) {

    this.createInformation = info;
    // console.log(this.createInformation);
    let editTable = document.getElementById("tbody");
    let tr = document.createElement("tr");
    let td0 = document.createElement("td");
    td0.innerHTML = this.createInformation.subject;
    let td1 = document.createElement("td");
    td1.innerHTML = this.recordData.teamName;
    let td2 = document.createElement("td");
    td2.innerHTML = this.recordData.ownerName;
    let td3 = document.createElement("td");
    td3.innerHTML = this.createInformation.medium;
    let td4 = document.createElement("td");
    td4.innerHTML = "Pending";
    let td5 = document.createElement("td");
    var myDate = new Date();
    td5.innerHTML = myDate.toLocaleString();
    let td6 = document.createElement("td");
    tr.appendChild(td0);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);
    editTable.appendChild(tr);
    alert("Create Successfully!");
  }

}
