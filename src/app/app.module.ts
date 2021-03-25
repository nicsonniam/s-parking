import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchoverlayComponent } from './searchoverlay/searchoverlay.component';
import { HttpClientModule } from '@angular/common/http';
import { PopupdialogComponent } from './popupdialog/popupdialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SpinnerComponent } from './spinner/spinner.component'; 
import { PostsService } from './posts.service';
import { httpInterceptProviders } from './http-interceptors';

@NgModule({
  declarations: [
    AppComponent,
    SearchoverlayComponent,
    PopupdialogComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatDialogModule,
    BrowserAnimationsModule 
  ],
  providers: [PostsService,httpInterceptProviders],
  bootstrap: [AppComponent],
  entryComponents: [PopupdialogComponent]
})
export class AppModule { }
