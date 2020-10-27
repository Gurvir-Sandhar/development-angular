import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {AboutComponent} from './about/about.component';
import {AppointmentsComponent} from './appointments/appointments.component';

const routes: Routes = [
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'appointments',
    component: AppointmentsComponent
  },
  // otherwise redirect to home
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }


