import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { AttendComponent } from './attend/attend.component';

const routes: Route[] = [
  { path: '', component: HomeComponent },
  { path: 'attend', component: AttendComponent }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class HomeRouterModule { }
