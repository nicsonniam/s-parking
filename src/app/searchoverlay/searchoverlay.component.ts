import { Component, OnInit } from '@angular/core';
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
  keyword: string;
  click: boolean = false;
  clickCount: number = 0;
  searchResult=[];
  selectedAdd: any;
  constructor(
    public postData:PostsService,
    public dialog:MatDialog
  ) {
    this.searchState=0;
    this.getCarparkAvailability();
   }
 
  ngOnInit(): void {
  } 
  getCarparkAvailability(){
    this.postData.getCarparkAvailability().subscribe((result)=>{
      this.cpAvailData=Object.assign([],result);
      this.cpAvail = this.cpAvailData.items[0];
    });
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
    this.searchState=0;
  }
  search(keyword:string,carparkId:string){
    this.click=true;
    //console.log(keyword,",",carparkId);
    if(this.clickCount<2){
      if(keyword){
        if(keyword.replace(/\s/g, "")===""){
          alert("Please enter a valid search term or car park number.");
        }else{
          this.postData.searchAdd(keyword.toUpperCase()).subscribe((result)=>{
            var searchResult=Object.assign([], result);
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
              this.selectedAdd = Object.assign([], result);
              if(this.selectedAdd.message=="success"){
                alert("Address found (WIP)")
              }else{
                this.searchState=1;
              }
              this.searchState=2;
            });
          });  
        }
      }else if(carparkId){
        if(carparkId.replace(/\s/g, "")===""){
          alert("Please enter a valid search term or car park number.");
        }else{
          this.postData.searchCarparkId(carparkId.toUpperCase()).subscribe((result)=>{
            var searchResult=Object.assign([], result);  
            //console.log(searchResult);
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
                //console.log(this.selectedCp);
                this.searchState=2;
                for(let i=0; i<this.cpAvail.carpark_data.length;i++){
                  if(this.cpAvail.carpark_data[i].carpark_number == this.selectedCp.carparkId){
                    this.selectedCp.totalLots = this.cpAvail.carpark_data[i].carpark_info[0].total_lots;
                    this.selectedCp.lotsAvail = this.cpAvail.carpark_data[i].carpark_info[0].lots_available;
                  }
                }
                this.selectedCp.parkingAvail = Math.round((this.selectedCp.lotsAvail / this.selectedCp.totalLots) * 100);
                //console.log(this.selectedCp.parkingAvail);
              }else{
                this.searchState=1;
              }
            });
          });
        }
      }else{
        alert("Please enter a valid search term or car park number.");
        this.clickCount=0;
      }
    }
  }
}
