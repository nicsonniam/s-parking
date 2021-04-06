import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popupdialog',
  templateUrl: './popupdialog.component.html',
  styleUrls: ['./popupdialog.component.scss']
})
export class PopupdialogComponent implements OnInit {
  type:string;
  keyword:string;
  matchCount:number;
  searchResults=[];
  nearbyCp=[];
  noResults:boolean;
  tooManyResults:boolean;
  enoughResults: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private dialogRef: MatDialogRef<PopupdialogComponent>
  ) 
  {
    this.noResults=false;
    this.tooManyResults=false; 
    this.enoughResults=false;
    this.type = data.type;
    this.keyword = data.keyword;
    if(this.type=="keyword"){
      this.searchResults=Object.assign([], data.data.results);
      this.matchCount=data.data.found;
      if(this.matchCount==0){
        this.noResults=true;
      }
      else if(this.matchCount>10){
        this.tooManyResults = true; 
      }
      else{
        this.enoughResults = true;
      }
    }else if(this.type=="carparkid"){
      this.searchResults=Object.assign([], data.data.result.records);
      for(let i=0;i<this.searchResults.length;i++){
        if(this.searchResults[i].car_park_no!=this.keyword){
          this.searchResults.splice(i);
        }
      }
      //console.log(this.searchResults);
      this.matchCount=this.searchResults.length;
      if(this.matchCount==0){
        this.noResults=true;
      }
      else if(this.matchCount>10){
        this.tooManyResults = true;
      }
      else{
        this.enoughResults = true;
      }
    }else if(this.type=="selectCarpark"){
      this.searchResults=Object.assign([], data.data);
      this.matchCount=this.searchResults.length;
    }
    //console.log(this.noResults);
  }

  ngOnInit(): void {
  }
  closeDialog() {
    var data = {
      message: "failed",
      address: null,
      carparkId: null,
      shortTermParking: null,
      carparkType: null,
      nightParking: null,
      parkingSystemType: null,
      freeParking :null,
      parkingAvail: 0,
      totalLots: 0,
      lotsAvail: 0
    }
    this.dialogRef.close(data);
  }
  selectCarpark(carpark){
    this.dialogRef.close(carpark);
  }
  selectLocation(address:string,type:string){
    if(this.tooManyResults||this.noResults){
      var data = {
        message: "failed",
        address: address,
        carparkId: null,
        shortTermParking: null,
        carparkType: null,
        nightParking: null,
        parkingSystemType: null,
        freeParking :null,
        parkingAvail: 0,
        totalLots: 0,
        lotsAvail: 0,
        x:null,
        y:null
      }
      this.dialogRef.close(data);
    }else{
      if(type=="carparkid"){
        //console.log(this.searchResults);
        for(let i=0;i<this.searchResults.length;i++){
          var carparkId = this.searchResults[i].car_park_no;
          var shortTermParking = this.searchResults[i].short_term_parking;
          var carparkType = this.searchResults[i].car_park_type;
          var nightParking = this.searchResults[i].night_parking;
          var parkingSystemType = this.searchResults[i].type_of_parking_system;
          var freeParking = this.searchResults[i].free_parking;
          var x = this.searchResults[i].x_coord;
          var y = this.searchResults[i].y_coord;
        }
        var data = {
          message: "success",
          address: address,
          carparkId: carparkId,
          shortTermParking: shortTermParking,
          carparkType: carparkType,
          nightParking: nightParking,
          parkingSystemType: parkingSystemType,
          freeParking :freeParking,
          parkingAvail: 0,
          totalLots: 0,
          lotsAvail: 0,
          x:x,
          y:y
        }
        //console.log(dataCPId);
        this.dialogRef.close(data);
      }else if(type==="keyword"){
        //console.log(this.searchResults);
        for(let i=0;i<this.searchResults.length;i++){
          if(this.searchResults[i].ADDRESS===address){
            var carparkId = this.searchResults[i].car_park_no;
            var shortTermParking = this.searchResults[i].short_term_parking;
            var carparkType = this.searchResults[i].car_park_type;
            var nightParking = this.searchResults[i].night_parking;
            var parkingSystemType = this.searchResults[i].type_of_parking_system;
            var freeParking = this.searchResults[i].free_parking;
            var x = this.searchResults[i].X;
            var y = this.searchResults[i].Y;
          }
        }
        var data = {
          message: "success",
          address: address,
          carparkId: carparkId,
          shortTermParking: shortTermParking,
          carparkType: carparkType,
          nightParking: nightParking,
          parkingSystemType: parkingSystemType,
          freeParking :freeParking,
          parkingAvail: 0,
          totalLots: 0,
          lotsAvail: 0,
          x:x,
          y:y
        }
        this.dialogRef.close(data);
      }
    }
  }
}
