import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { AttendComponent } from './attend/attend.component';

const routes: Route[] = [
  { path: 'home', component: HomeComponent },
  { path: 'attend', component: AttendComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full', },
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
