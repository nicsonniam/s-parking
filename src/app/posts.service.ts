import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  searchUrl = "https://developers.onemap.sg/commonapi/search?searchVal=";
  searchCarparkUrl = "https://data.gov.sg/api/action/datastore_search?resource_id=139a3035-e624-4f56-b63f-89ae28d4ae4c&q=";
  carparkAvailUrl = "https://api.data.gov.sg/v1/transport/carpark-availability";
  //allCarparkUrl = "https://data.gov.sg/api/action/datastore_search?resource_id=139a3035-e624-4f56-b63f-89ae28d4ae4c&limit=3000";
  allCarparkUrl = "https://nicsonniam.github.io/data/hdb-carpark-information.json";
  cpRatesUrl = "https://nicsonniam.github.io/data/carpark-rates-att.json";
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
  public getCarparkAvailability(){
    return this.http.get(this.carparkAvailUrl)
  }
  public getAllCarparks(){
    return this.http.get(this.allCarparkUrl)
  }
}


