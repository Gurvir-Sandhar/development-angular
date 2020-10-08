import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-quickview',
  templateUrl: './quickview.component.html',
  styleUrls: ['./quickview.component.css']
})
export class QuickviewComponent implements OnInit {

  @Output() toggleDetail = new EventEmitter();

  detail;
  list = false;
  users;
  reassignShow = false;
  changeTo;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.detail = this.apiService.getInformation();
    this.apiService.getApptUsers().subscribe(data => {
      this.users = data;
    });
  }

  closeQuickView() {
    this.toggleDetail.emit();
  }

  changeSelect(index) {
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

  public check() {
    if(this.detail) return true;
    return false;
  }

  public show() {
    this.list = !this.list;
  }

  reassign() {
    this.detail.ownerName = this.changeTo;
  }

}
