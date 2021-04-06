import { Component, HostListener, OnInit } from '@angular/core';
import { PostsService } from '../posts.service';
import { MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { PopupdialogComponent } from '../popupdialog/popupdialog.component';

@Component({
  selector: 'app-searchoverlay',
  templateUrl: './searchoverlay.component.html',
  styleUrls: ['./searchoverlay.component.scss']
})
export class SearchoverlayComponent implements OnInit {
  searchState: any;
  selectedCp: any;
  cpAvail: any;
  cpAvailData: any;
  allCpList:any;
  allCp:any;
  keyword: string;
  click: boolean = false; 
  clickCount: number = 0; 
  searchResult=[]; 
  nearbyCp=[];
  night: boolean;
  day: boolean;
  resultNotIn: boolean;
  innerWidth: number;
  constructor( 
    public postData:PostsService,
    public dialog:MatDialog
  ) {
    this.searchState=0;
    this.getCarparkAvailability();
    this.checkTime();
    this.getAllCarparks(); 
  }
 
  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
  }
  @HostListener('window:resize', ['$event']) 
    onResize(event) {
    this.innerWidth = window.innerWidth;
    //console.log(this.innerWidth);
  }
  checkTime() {
    var date = new Date();
    var hours = date.getHours();
    if(hours>=19){
      this.night=true;
      this.day=false;
    }else{
      this.day=true;
      this.night=false;
    }
  }
  getAllCarparks(){
    this.postData.getAllCarparks().subscribe(result=>{
      this.allCpList=Object.assign([],result);
      //console.log(result);
      //this.allCp = this.allCpList.result.records;
      this.allCp = this.allCpList;
      //console.log(this.allCp);
    });
  } 
  getCarparkAvailability(){
    this.postData.getCarparkAvailability().subscribe(
      result=>{
        this.cpAvailData=Object.assign([],result);
        this.cpAvail = this.cpAvailData.items[0];
        //console.log(this.cpAvail);
      },
      error=>{
        console.log(error);
      }
    );
  }  
  getStarted(){
    this.searchState=1;
  }
  omit_special_char(event){   
    var k;  
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
  }
  back(){
    this.searchState=1;
  }
  search(keyword:string,carparkId:string){
    this.click=true;
    this.resultNotIn=false;
    this.nearbyCp=[];
    //console.log(keyword,",",carparkId);
    if(keyword){ //if keyword search is used
      if(keyword.replace(/\s/g, "")===""){
        this.click=false;
        alert("Please enter a valid search term or car park number.");
      }else{
        this.resultNotIn=true;
        this.postData.searchAdd(keyword.toUpperCase()).subscribe((result)=>{
          var searchResult=null;
          while(searchResult==null){
            if(result!=null){
              searchResult=Object.assign([], result);
              this.resultNotIn=false;
              //console.log(searchResult);
            }else{
              this.resultNotIn=true;
            }
          }
          //console.log(searchResult);
          //console.log(searchResult);
          const dialogConfig = new MatDialogConfig;
          dialogConfig.autoFocus = true;
          dialogConfig.data = {
            data:searchResult,
            type: "keyword",
            keyword:keyword.toUpperCase()
          };
          dialogConfig.width = '480px';
          dialogConfig.height = '380px';
          const dialogRef = this.dialog.open(PopupdialogComponent, dialogConfig);
          dialogRef.afterClosed().subscribe(result => {
            this.click=false;
            this.selectedCp = Object.assign([], result);
            //console.log(result);
            if(this.selectedCp.message=="success"){
              //alert("Address found (WIP)");
              this.searchState=1;
              //this.searchState=2;
              var x = parseInt(this.selectedCp.x);
              var y = parseInt(this.selectedCp.y);
              //console.log(this.allCp[0]);
              //console.log(xStr,yStr);
              for(let i=0; i<this.allCp.length;i++){
                var x1 = parseInt(this.allCp[i].x_coord);
                var y1 = parseInt(this.allCp[i].y_coord);
                var factor = 90;
                if(x1>x){
                  var xdiff = x1-x;
                }else{
                  var xdiff = x-x1; 
                }  
                if(y1>y){
                  var ydiff = y1-y;
                }else{
                  var ydiff = y-y1;
                }       
                if(ydiff!=0&&xdiff!=0){ //filter all carparks for nearby ones
                  if(xdiff<factor && ydiff<factor){
                    var data = {
                      message: "success",
                      address: this.allCp[i].address,
                      carparkId: this.allCp[i].car_park_no,
                      shortTermParking: this.allCp[i].short_term_parking,
                      carparkType: this.allCp[i].car_park_type,
                      nightParking: this.allCp[i].night_parking,
                      parkingSystemType: this.allCp[i].type_of_parking_system,
                      freeParking :this.allCp[i].free_parking,
                      parkingAvail: 0,
                      totalLots: 0,
                      lotsAvail: 0,
                      x:this.allCp[i].x_coord,
                      y:this.allCp[i].y_coord
                    }     
                    this.nearbyCp.push(data);
                  }
                }
              }
              if(this.nearbyCp.length==0){ //increase radius if no nearby cp found after first pass
                for(let i=0; i<this.allCp.length;i++){
                  var x1 = parseInt(this.allCp[i].x_coord);
                  var y1 = parseInt(this.allCp[i].y_coord);
                  var factor = 120;
                  if(x1>x){
                    var xdiff = x1-x;
                  }else{
                    var xdiff = x-x1; 
                  }  
                  if(y1>y){
                    var ydiff = y1-y;
                  }else{
                    var ydiff = y-y1;
                  }       
                  if(ydiff!=0&&xdiff!=0){ //filter all carparks for nearby ones
                    if(xdiff<factor && ydiff<factor){
                      var data = {
                        message: "success",
                        address: this.allCp[i].address,
                        carparkId: this.allCp[i].car_park_no,
                        shortTermParking: this.allCp[i].short_term_parking,
                        carparkType: this.allCp[i].car_park_type,
                        nightParking: this.allCp[i].night_parking,
                        parkingSystemType: this.allCp[i].type_of_parking_system,
                        freeParking :this.allCp[i].free_parking,
                        parkingAvail: 0,
                        totalLots: 0,
                        lotsAvail: 0,
                        x:this.allCp[i].x_coord,
                        y:this.allCp[i].y_coord
                      }     
                      this.nearbyCp.push(data);
                    }
                  }
                }
              }
              for(let i=0; i<this.cpAvail.carpark_data.length;i++){
                for(let j=0;j<this.nearbyCp.length;j++){ 
                  if(this.nearbyCp[j].carparkId==this.cpAvail.carpark_data[i].carpark_number){
                    if(this.cpAvail.carpark_data[i].carpark_info[0].lot_type=="C"){
                      var lotsAvail = parseInt(this.cpAvail.carpark_data[i].carpark_info[0].lots_available);
                      var totalLots = parseInt(this.cpAvail.carpark_data[i].carpark_info[0].total_lots);
                      var lotsTaken = totalLots - lotsAvail;
                      var parkingAvail = Math.round( (lotsTaken/totalLots) *100);
                      this.nearbyCp[j].lotsAvail= lotsAvail;
                      this.nearbyCp[j].totalLots = totalLots;
                      this.nearbyCp[j].parkingAvail = parkingAvail; 
                    }
                  }
                }
              }
              //console.log(this.nearbyCp);
              if(this.nearbyCp.length == 1){ //if only one nearby carpark is found, set it as selected cp and clear all nearby cp
                this.selectedCp.push(this.nearbyCp[0]);
                this.selectedCp.carparkId=this.nearbyCp[0].carparkId;
                this.selectedCp.carparkType=this.nearbyCp[0].carparkType;
                this.selectedCp.freeParking=this.nearbyCp[0].freeParking;
                this.selectedCp.lotsAvail=this.nearbyCp[0].lotsAvail;
                this.selectedCp.nightParking=this.nearbyCp[0].nightParking;
                this.selectedCp.parkingAvail=this.nearbyCp[0].parkingAvail;
                this.selectedCp.parkingSystemType=this.nearbyCp[0].parkingSystemType;
                this.selectedCp.shortTermParking=this.nearbyCp[0].shortTermParking;
                this.selectedCp.totalLots=this.nearbyCp[0].totalLots;
                //console.log(this.selectedCp);
                this.nearbyCp=[];
                var x = parseInt(this.selectedCp.x);
                var y = parseInt(this.selectedCp.y);
                //console.log(x,y);
                var factor = 300; //distance factor
                for(let i=0; i<this.allCp.length;i++){
                  var x1 = parseInt(this.allCp[i].x_coord);
                  var y1 = parseInt(this.allCp[i].y_coord);
                  if(x1>x){
                    var xdiff = x1-x;
                  }else{
                    var xdiff = x-x1; 
                  }  
                  if(y1>y){
                    var ydiff = y1-y;
                  }else{
                    var ydiff = y-y1;
                  }       
                  if(ydiff!=0&&xdiff!=0){ 
                    if((xdiff<factor && ydiff<factor) && this.allCp[i].car_park_no!=this.selectedCp[0].carparkId){
                      var data = {
                        message: "success",
                        address: this.allCp[i].address,
                        carparkId: this.allCp[i].car_park_no,
                        shortTermParking: this.allCp[i].short_term_parking,
                        carparkType: this.allCp[i].car_park_type,
                        nightParking: this.allCp[i].night_parking,
                        parkingSystemType: this.allCp[i].type_of_parking_system,
                        freeParking :this.allCp[i].free_parking,
                        parkingAvail: 0,
                        totalLots: 0,
                        lotsAvail: 0,
                        x:this.allCp[i].x_coord,
                        y:this.allCp[i].y_coord
                      }     
                      this.nearbyCp.push(data);
                    }
                  } 
                }
                //console.log(this.selectedCp);
                //console.log(this.nearbyCp);
                for(let i=0; i<this.cpAvail.carpark_data.length;i++){
                  for(let j=0;j<this.nearbyCp.length;j++){ 
                    if(this.nearbyCp[j].carparkId==this.cpAvail.carpark_data[i].carpark_number){
                      if(this.cpAvail.carpark_data[i].carpark_info[0].lot_type=="C"){
                        var lotsAvail = parseInt(this.cpAvail.carpark_data[i].carpark_info[0].lots_available);
                        var totalLots = parseInt(this.cpAvail.carpark_data[i].carpark_info[0].total_lots);
                        var lotsTaken = totalLots - lotsAvail;
                        var parkingAvail = Math.round( (lotsTaken/totalLots) *100);
                        this.nearbyCp[j].lotsAvail= lotsAvail;
                        this.nearbyCp[j].totalLots = totalLots;
                        this.nearbyCp[j].parkingAvail = parkingAvail; 
                      }
                    }
                  }
                }
                this.searchState=2;
              }
              else if(this.nearbyCp.length == 0){ //if no nearby carparks are found
                alert("no nearby HDB carparks found")
              }
              else{ //if multiple nearby carparks are found, trigger dialog to instruct user to select one
                const dialogConfig = new MatDialogConfig;
                dialogConfig.autoFocus = true;
                dialogConfig.data = {
                  data:this.nearbyCp,
                  type: "selectCarpark",
                  keyword:null
                };
                dialogConfig.width = '480px';
                dialogConfig.height = '380px';
                const dialogRef = this.dialog.open(PopupdialogComponent, dialogConfig);
                dialogRef.afterClosed().subscribe(result => {
                  this.selectedCp = Object.assign([], result);
                  //console.log(this.selectedCp);
                  this.nearbyCp=[];
                  var x = parseInt(this.selectedCp.x);
                  var y = parseInt(this.selectedCp.y);
                  //console.log(x,y); 
                  var factor = 300; //distance factor
                  for(let i=0; i<this.allCp.length;i++){
                    var x1 = parseInt(this.allCp[i].x_coord);
                    var y1 = parseInt(this.allCp[i].y_coord);
                    if(x1>x){
                      var xdiff = x1-x;
                    }else{
                      var xdiff = x-x1; 
                    }  
                    if(y1>y){
                      var ydiff = y1-y;
                    }else{
                      var ydiff = y-y1;
                    }       
                    if(ydiff!=0&&xdiff!=0){ 
                      if(xdiff<factor && ydiff<factor){
                        var data = {
                          message: "success",
                          address: this.allCp[i].address,
                          carparkId: this.allCp[i].car_park_no,
                          shortTermParking: this.allCp[i].short_term_parking,
                          carparkType: this.allCp[i].car_park_type,
                          nightParking: this.allCp[i].night_parking,
                          parkingSystemType: this.allCp[i].type_of_parking_system,
                          freeParking :this.allCp[i].free_parking,
                          parkingAvail: 0,
                          totalLots: 0,
                          lotsAvail: 0,
                          x:this.allCp[i].x_coord,
                          y:this.allCp[i].y_coord
                        }     
                        this.nearbyCp.push(data);
                      }
                    } 
                  }
                  for(let i=0; i<this.cpAvail.carpark_data.length;i++){
                    for(let j=0;j<this.nearbyCp.length;j++){ 
                      if(this.nearbyCp[j].carparkId==this.cpAvail.carpark_data[i].carpark_number){
                        if(this.cpAvail.carpark_data[i].carpark_info[0].lot_type=="C"){
                          var lotsAvail = parseInt(this.cpAvail.carpark_data[i].carpark_info[0].lots_available);
                          var totalLots = parseInt(this.cpAvail.carpark_data[i].carpark_info[0].total_lots);
                          var lotsTaken = totalLots - lotsAvail;
                          var parkingAvail = Math.round( (lotsTaken/totalLots) *100);
                          this.nearbyCp[j].lotsAvail= lotsAvail;
                          this.nearbyCp[j].totalLots = totalLots;
                          this.nearbyCp[j].parkingAvail = parkingAvail; 
                        }
                      }
                    }
                  }
                  this.searchState=2;
                  });
                }
              }else if(this.selectedCp.message=="failed"){
                this.searchState=1;
              }
          });
        });
      }
    }else if(carparkId){ //if carpark number search is used
      if(carparkId.replace(/\s/g, "")===""){
        alert("Please enter a valid search term or car park number.");
      }else{
        this.resultNotIn=true;
        this.postData.searchCarparkId(carparkId.toUpperCase()).subscribe((result)=>{
          //console.log(searchResult);
          var searchResult=null;
          while(searchResult==null){
            if(result!=null){
              searchResult=Object.assign([], result);
              this.resultNotIn=false;
              //console.log(searchResult);
            }else{
              this.resultNotIn=true;
            }
          }
          const dialogConfig = new MatDialogConfig;
          dialogConfig.autoFocus = true;
          dialogConfig.data = {
            data:searchResult,
            type: "carparkid",
            keyword:carparkId.toUpperCase()
          };
          dialogConfig.width = '480px';
          dialogConfig.height = '380px';
          const dialogRef = this.dialog.open(PopupdialogComponent, dialogConfig);
          dialogRef.afterClosed().subscribe(result => {
            this.click=false;
            this.selectedCp = Object.assign([], result);
            if(this.selectedCp.message=="success"){
              this.searchState=2;
              for(let i=0; i<this.cpAvail.carpark_data.length;i++){
                if(this.cpAvail.carpark_data[i].carpark_number == this.selectedCp.carparkId){
                  this.selectedCp.totalLots = parseInt(this.cpAvail.carpark_data[i].carpark_info[0].total_lots);
                  this.selectedCp.lotsAvail = parseInt(this.cpAvail.carpark_data[i].carpark_info[0].lots_available);
                  break;
                }
              }
              this.selectedCp.parkingAvail = Math.round(((this.selectedCp.totalLots - this.selectedCp.lotsAvail) / this.selectedCp.totalLots) * 100);
              var x = parseInt(this.selectedCp.x);
              var y = parseInt(this.selectedCp.y);
              //console.log(x,y);
              var factor = 300; //distance factor
              for(let i=0; i<this.allCp.length;i++){
                var x1 = parseInt(this.allCp[i].x_coord);
                var y1 = parseInt(this.allCp[i].y_coord);
                if(x1>x){
                  var xdiff = x1-x;
                }else{
                  var xdiff = x-x1; 
                }  
                if(y1>y){
                  var ydiff = y1-y;
                }else{
                  var ydiff = y-y1;
                }       
                if(ydiff!=0&&xdiff!=0){ 
                  if(xdiff<factor && ydiff<factor){
                    var data = {
                      message: "success",
                      address: this.allCp[i].address,
                      carparkId: this.allCp[i].car_park_no,
                      shortTermParking: this.allCp[i].short_term_parking,
                      carparkType: this.allCp[i].car_park_type,
                      nightParking: this.allCp[i].night_parking,
                      parkingSystemType: this.allCp[i].type_of_parking_system,
                      freeParking :this.allCp[i].free_parking,
                      parkingAvail: 0,
                      totalLots: 0,
                      lotsAvail: 0,
                      x:this.allCp[i].x_coord,
                      y:this.allCp[i].y_coord
                    }     
                    this.nearbyCp.push(data);
                  }
                } 
              }
              for(let i=0; i<this.cpAvail.carpark_data.length;i++){
                for(let j=0;j<this.nearbyCp.length;j++){ 
                  if(this.nearbyCp[j].carparkId==this.cpAvail.carpark_data[i].carpark_number){
                    var lotsAvail = parseInt(this.cpAvail.carpark_data[i].carpark_info[0].lots_available);
                    var totalLots = parseInt(this.cpAvail.carpark_data[i].carpark_info[0].total_lots);
                    var lotsTaken = totalLots - lotsAvail;
                    var parkingAvail = Math.round( (lotsTaken/totalLots) *100);
                    this.nearbyCp[j].lotsAvail= lotsAvail;
                    this.nearbyCp[j].totalLots = totalLots;
                    this.nearbyCp[j].parkingAvail = parkingAvail; 
                  }
                }
              }
            }else if(this.selectedCp.message=="failed"){
              this.searchState=1; 
            } 
          });
        });
      }
    }else{
      alert("Please enter a valid search term or car park number.");
      this.clickCount=0;
    }
    this.click=false; 
  }
}
