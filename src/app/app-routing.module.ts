import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainViewComponent} from "./main-view/main-view.component";
import {SettingsViewComponent} from "./settings-view/settings-view.component";
import {SettingsFormComponent} from "./settings-view/settings-form/settings-form.component";
import {RagToolsViewComponent} from "./rag-tools-view/rag-tools-view.component";
import {LoginViewComponent} from "./login-view/login-view.component";
import {isUserLoggedGuard} from "./guards/is-user-logged.guard";
import {RegisterViewComponent} from "./login-view/register-view/register-view.component";

const routes: Routes = [
  {
    path:'',
    component:LoginViewComponent,
    pathMatch:"full"
  },
  {
    path:'register',
    component:RegisterViewComponent,
    pathMatch:"full"
  },
  {
    path: 'home',
    component: MainViewComponent,
    pathMatch:"full",
    canActivate:[isUserLoggedGuard]
  },
  {
    path: 'settings',
    component: SettingsViewComponent,
    canActivate:[isUserLoggedGuard],
    children:[
      {
        path: ':settingKey',
        component:SettingsFormComponent,
        outlet:'settings'
      },
    ]
  },
  {
    path: 'rag-tools',
    canActivate:[isUserLoggedGuard],
    component: RagToolsViewComponent,
  }

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
