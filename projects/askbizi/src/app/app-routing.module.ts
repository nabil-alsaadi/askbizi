import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';
import { HomeComponent } from './components/home/home.component';
import { NewClaimComponent } from './components/new-claim/new-claim.component';

const routes: Routes = [
  // { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'new-claim', component: NewClaimComponent },
  { path: 'coming-soon', component: ComingSoonComponent },
];


// const routes: Routes = [
//   //{ path: '', redirectTo: '/home', pathMatch: 'full' },
//   { path: '', component: ComingSoonComponent },
//   // { path: 'new-claim', component: NewClaimComponent },
//   // { path: 'coming-soon', component: ComingSoonComponent },
// ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
