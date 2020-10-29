import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-quickview',
  templateUrl: './quickview.component.html',
  styleUrls: ['./quickview.component.css']
})
export class QuickviewComponent implements OnInit {

  @Output() toggleDetail = new EventEmitter();
  @Output() toggleRecordFromDetail = new EventEmitter();

  detail;
  list = false;
  users;
  reassignShow = false;
  changeTo;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.detail = this.apiService.getInformation();
    this.apiService.getApptUsers().subscribe(data => {
      this.users = data;
    });
  }

  /**
   * Emits to parent component 'Appointments' to toggle this view being shown
   */
  closeQuickView(): void {
    this.toggleDetail.emit();
  }

  /**
   * Emits to Parent component 'Appointments' to close this view and open appt-records view
   */
  openRecordView(): void {
    this.toggleRecordFromDetail.emit();
  }

  /**
   * Changes the select value
   * @param index int for which users to display  in dropdown
   */
  changeSelect(index): void {
    if(index != "") {
      this.changeTo = this.users[index].name;
    } else {
      this.reassignShow = false;
      return;
    }

    if(this.changeTo) {
      this.reassignShow = true;
    }
  }

  /**
   * Returns true/false if detail variable is valid value
   */
  public check(): boolean {
    if(this.detail) return true;
    return false;
  }

  /**
   * Hides/shows the select dropdown list
   */
  public show(): void {
    this.list = !this.list;
  }

  /**
   * NOT FINISHED - SHOULD CHANGE THE ACTUAL OBJECT IN SERVER
   * Changes the name being displayed - changed value of who the user is meeting
   */
  reassign(): void {
    this.detail.ownerName = this.changeTo;
  }

}
