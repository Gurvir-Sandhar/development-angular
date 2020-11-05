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
  apptTableData;
  recordData;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apptTableData = this.apiService.getInformation();
    this.apiService.getRecordData().subscribe(data => {
      console.log(data);  // for debugging
      this.recordData = data;
    });
  }

  closeRecordView(): void {
    this.toggleRecord.emit();
  }

  dropMenu(): void {
    document.getElementById('myDropdown').classList.toggle('show');
  }
}
