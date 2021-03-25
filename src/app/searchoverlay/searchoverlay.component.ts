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
  keyword: string;
  click: boolean = false;
  clickCount: number = 0;
  searchResult=[];
  constructor(
    public postData:PostsService,
    public dialog:MatDialog
  ) { }
 
  ngOnInit(): void {
    this.searchState=0;
  }   
  getStarted(){
    this.searchState=1;
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
