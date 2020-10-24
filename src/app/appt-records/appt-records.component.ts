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
  recordData;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.recordData = this.apiService.getInformation();
    console.log(this.recordData); // for debugging
  }

  closeRecordView(): void {
    this.toggleRecord.emit();
  }

  dropMenu(): void {
    document.getElementById('myDropdown').classList.toggle('show');
  }
}
