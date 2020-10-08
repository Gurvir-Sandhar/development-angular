import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {

  detail = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleDetail() {
    this.detail = !this.detail;
  }

}
