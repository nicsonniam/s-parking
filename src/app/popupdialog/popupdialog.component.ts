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
      //console.log(data.data.found);
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
      console.log(this.searchResults);
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
    }
    //console.log(this.noResults);
  }

  ngOnInit(): void {
  }
  closeDialog() {
    this.dialogRef.close();
  }
  selectLocation(address:string,type:string){
    if(this.tooManyResults||this.noResults){
      var data = {
        message: "failed",
      }
      this.dialogRef.close(data);
    }else{
      if(type=="carparkid"){
        for(let i=0;i<this.searchResults.length;i++){
          var carparkId = this.searchResults[i].car_park_no;
          var shortTermParking = this.searchResults[i].short_term_parking;
          var carparkType = this.searchResults[i].car_park_type;
          var nightParking = this.searchResults[i].night_parking;
          var parkingSystemType = this.searchResults[i].type_of_parking_system;
          var freeParking = this.searchResults[i].free_parking;
        }
        var dataCPId = {
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
          lotsAvail: 0
        }
        //console.log(dataCPId);
        this.dialogRef.close(dataCPId);
      }else{
        var dataAdd = {
          message: "success",
          address: address
        }
        this.dialogRef.close(dataAdd);
      }
    }
  }
}
