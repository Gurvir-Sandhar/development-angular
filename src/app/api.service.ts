import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  information;

  constructor(private http: HttpClient) { }

  public httpGET(url) {
    return this.http.get(url);
  }

  public getApptUsers() {
    return this.http.get('http://localhost:6543/apps/api/test/appt_users');
  }

  public saveUserInformation(user) {
    this.information = user;
  }

  public getInformation() {
    return this.information;
  }
}
