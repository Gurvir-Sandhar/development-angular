import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  params;

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  apiURL: string = 'http://localhost:6543/apps/api/test/';

  constructor(private http: HttpClient) { }

  /**
   * Abstract function to make get call 
   * @param endpoint what we are querying the API for
   */
  public query(endpoint: string) {
    return this.http.get(this.apiURL+endpoint)
  }

  /**
   * Post call with simple http header
   * @param endpoint what we are querying the API for
   * @param payload the body of the post - what is being sent
   */
  public post(endpoint: string, payload) {
    let body = JSON.stringify(payload);
    return this.http.post(this.apiURL+endpoint, body, this.httpOptions)
  }

  /**
   * 
   * @param teamId 
   * @param owner 
   * @param day 
   */
  public stateQuery(teamId: string, owner: string, day: string) {
    if (teamId == undefined)
      teamId = '';
    if (owner == undefined)
      owner = '';
    if (day == undefined)
      day = '';
    return this.http.get(this.apiURL+'filters?teamId='+teamId+'&pickOwner='+
      owner+'&pickDay='+day)
  }

  /**
   * Function that gets the users - specific GET function
   */
  public getApptUsers() {
    return this.http.get(this.apiURL+'appt_users');
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
   * Function to save the parameters so the appointment tables can be filtered with them
   * @param params object with parameters that the appointments tables will use to filter
   */
  public saveParams(params) {
    this.params = params;
  }

  /**
   * Function to send parameters data to requested location  
   */
  public getParams() {
    return this.params;
  }

  /**
   * Function that gets Appointments data, includes attachments, contact, history, interaction, messages, pvtNotes
   */
  public getInteractionData() {
    return this.http.get('http://localhost:6543/apps/api/test/appointment');
  }

}
