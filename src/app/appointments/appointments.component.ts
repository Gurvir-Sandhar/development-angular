import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {

  // boolean conditions control which view will be shown
  table = true;       // appointments table
  detail = false;     // appointment details
  record = false;     // student record
  load = true;        // used for reloading the appointments table

  constructor(private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void { }

  toggleDetail(): void {
    this.table = !this.table;
    this.detail = !this.detail;
  }

  toggleRecord(): void {
    this.table = !this.table;
    this.record = !this.record;
  }

  toggleRecordFromDetail(): void {
    this.detail = !this.detail;
    this.record = !this.record;
  }

  updateCurrentState() {
    this.load = false;
    this.changeDetector.detectChanges();
    this.load = true; 
  }
}
