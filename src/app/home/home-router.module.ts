import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { AttendComponent } from './attend/attend.component';
import { AttendGuard } from './attend.guard';

const routes: Route[] = [
  { path: 'home', component: HomeComponent, canActivate: [AttendGuard] },
  { path: 'attend', component: AttendComponent, canActivate: [AttendGuard] },
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
