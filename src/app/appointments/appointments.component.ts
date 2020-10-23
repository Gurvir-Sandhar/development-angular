import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {

  // boolean conditions control which view will be shown
  table = true;
  detail = false;
  record = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleDetail(): void {
    this.table = !this.table;
    this.detail = !this.detail;
  }

  toggleRecord(): void {
    this.table = !this.table;
    this.record = !this.record;
  }

}
