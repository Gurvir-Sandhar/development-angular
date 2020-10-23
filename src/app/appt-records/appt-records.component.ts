import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-appt-records',
  templateUrl: './appt-records.component.html',
  styleUrls: ['./appt-records.component.css']
})
export class ApptRecordsComponent implements OnInit {

  @Output() toggleRecord = new EventEmitter();

  isPhoto = false;
  name = 'name';
  id = 'id';
  email = 'email@pdx.edu';

  constructor() { }

  ngOnInit(): void {
  }

  closeRecordView(): void{
    this.toggleRecord.emit();
  }

}
