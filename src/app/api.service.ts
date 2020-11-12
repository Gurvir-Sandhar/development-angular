import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * Note I used two different ways we could use the GET functions.
 * Either we feed it the URL from the function call in the components,
 * OR
 * we set up specfic functions here that the components can call so the
 * components don't need to know the url - they could all be contained here
 * instead of being all over the code.
 * There are pros and cons to both.
 */

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  information;

  constructor(private http: HttpClient) { }

  /**
   * Abstract way to call GET function

   * @param url URL GET call will use
   */
  public httpGET(url) {
    return this.http.get(url);
  }

  /**
   * Function that gets the users - specific GET function
   */
  public getApptUsers() {
    return this.http.get('http://localhost:6543/apps/api/test/appt_users');
  }

  /**
   * Saves the user object into the information variable
   * @param user user object to be saved and used by component(s)
   */
  public saveUserInformation(user) {
    this.information = user;
  }

  /**
   * Returns the information variable to a component that calls it
   */
  public getInformation() {
    return this.information;
  }

  /**
   * Function that gets Record data, includes contact, attachments, and history
   */
  public getRecordData() {
    return this.http.get('http://localhost:6543/apps/api/test/record');
  }
}
