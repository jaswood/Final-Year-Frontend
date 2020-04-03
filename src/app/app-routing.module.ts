import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { MyJobsComponent } from './my-jobs/my-jobs.component';
import { JobHistoryComponent } from './job-history/job-history.component';
import { MyPageComponent } from './my-page/my-page.component';
import { ChatsComponent } from './chats/chats.component';
import { MapComponent } from './map/map.component';
import { CreateAccountComponent } from './create-account/create-account.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: UserProfileComponent},
  { path: 'create-account', component: CreateAccountComponent },
  { path: 'home', component: NavBarComponent,
    children: [
      { path: '', redirectTo: 'map', pathMatch: 'full'},
      { path: 'map', component: MapComponent, outlet: 'nav-links' },
      { path: 'my-jobs', component: MyJobsComponent, outlet: 'nav-links'},
      { path: 'job-history', component: JobHistoryComponent, outlet: 'nav-links'},
      { path: 'my-page', component: MyPageComponent, outlet: 'nav-links'},
      { path: 'chats', component: ChatsComponent, outlet: 'nav-links' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
