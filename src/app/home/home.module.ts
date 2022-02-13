import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRouterModule } from './home-router.module';

import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AttendComponent } from './attend/attend.component';

@NgModule({
  declarations: [
    HomeComponent,
    AttendComponent
  ],
  imports: [
    CommonModule,
    HomeRouterModule,
    MatButtonModule,
    MatListModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule
  ]
})
export class HomeModule { }
