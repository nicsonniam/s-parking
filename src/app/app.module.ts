import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchoverlayComponent } from './searchoverlay/searchoverlay.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchoverlayComponent,
    SearchoverlayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
