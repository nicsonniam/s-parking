import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  searchUrl = "https://developers.onemap.sg/commonapi/search?searchVal=";
  searchCarparkUrl = "https://data.gov.sg/api/action/datastore_search?resource_id=139a3035-e624-4f56-b63f-89ae28d4ae4c&q="
  
  constructor(
    private http:HttpClient
  ) {

  }
  public searchAdd(keyword:string){
    return this.http.get(this.searchUrl.concat(keyword,"&returnGeom=Y&getAddrDetails=Y"));
  }
  public searchCarparkId(carparkId:string){
    return this.http.get(this.searchCarparkUrl.concat(carparkId));
  }
}


