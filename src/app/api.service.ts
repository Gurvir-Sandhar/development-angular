import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiURL: string = 'http://localhost:6543/apps/api/test/'

  constructor(private http: HttpClient) { }

  // TODO: Need to write cases for anything except success 200
  
  public query(endpoint: string) {
    return this.http.get(this.apiURL+endpoint)
  }

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
}