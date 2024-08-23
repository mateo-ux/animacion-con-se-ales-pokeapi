import { NgModule } from '@angular/core';
import {MatPaginatorModule} from  '@angular/material/paginator' ;
import {MatTableModule} from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { MatListModule } from '@angular/material/list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [],
  imports: [

    MatPaginatorModule,
    MatTableModule,
    CommonModule,
    MatCardModule, 
    MatListModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule
  ],
  exports:[

    MatPaginatorModule,
    MatTableModule,
    CommonModule,
    MatCardModule, 
    MatButtonModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule
  ]
})
export class MaterialModule { }
