import { AsyncPipe, CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SalesProjectPageComponent } from './sales-project-page.component';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  exports: [
    SalesProjectPageComponent
  ],
  declarations: [
    SalesProjectPageComponent
  ],
  providers: [
    AsyncPipe
  ]
})
export class SalesProjectPageModule { }
