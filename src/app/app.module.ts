import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatDivider} from "@angular/material/divider";
import {MatButton, MatFabButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MainViewComponent } from './main-view/main-view.component';
import { ChatBarComponent } from './main-view/chat-bar/chat-bar.component';
import { StoreModule } from '@ngrx/store';
import {messageFeature} from "./store/message";
import {coreFeature} from "./store/core/core.reducer";
import { EffectsModule } from '@ngrx/effects';
import {MessageEffects} from "./store/message/message.effects";
import { LoadingViewComponent } from './loading-view/loading-view.component';
import { FooterComponent } from './footer/footer.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { ChatViewComponent } from './main-view/chat-view/chat-view.component';
import { MessageComponent } from './main-view/chat-view/message/message.component';
import { ActionMenuComponent } from './main-view/chat-view/message/action-menu/action-menu.component';
import { FolderStructureComponent } from './main-view/folder-structure/folder-structure.component';
import { SettingsViewComponent } from './settings-view/settings-view.component';
import { SettingsFormComponent } from './settings-view/settings-form/settings-form.component';
import { SettingsFormRecursiveComponent } from './settings-view/settings-form/settings-form-recursive/settings-form-recursive.component';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatCheckbox} from "@angular/material/checkbox";
import { MatInputModule } from "@angular/material/input";
import {MatChipGrid, MatChipInput, MatChipRow} from "@angular/material/chips";
import {
  MatAccordion, MatExpansionModule,
  MatExpansionPanel,
  MatExpansionPanelContent,
  MatExpansionPanelDescription
} from "@angular/material/expansion";
import {MatTooltip} from "@angular/material/tooltip";
import { RagToolsViewComponent} from "./rag-tools-view/rag-tools-view.component";
import { ExternalLinkDirective } from './external-link.directive';
import {SharedModule} from "./shared/shared.module";
import { LoginViewComponent } from './login-view/login-view.component';
import { RegisterViewComponent } from './login-view/register-view/register-view.component';
import {userFeature} from "./store/user/user.reducer";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    MainViewComponent,
    ChatBarComponent,
    LoadingViewComponent,
    FooterComponent,
    ChatViewComponent,
    MessageComponent,
    ActionMenuComponent,
    FolderStructureComponent,
    SettingsViewComponent,
    SettingsFormComponent,
    SettingsFormRecursiveComponent,
    RagToolsViewComponent,
    ExternalLinkDirective,
    LoginViewComponent,
    RegisterViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIcon,
    MatIconModule,
    MatExpansionModule,
    MatDivider,
    MatInputModule,
    MatIconButton,
    MatFabButton,
    StoreModule.forRoot({}, {}),
    StoreModule.forFeature(messageFeature.name, messageFeature.reducer),
    StoreModule.forFeature(userFeature.name, userFeature.reducer),
    StoreModule.forFeature(coreFeature.name, coreFeature.reducer),
    EffectsModule.forRoot([]),
    EffectsModule.forFeature(MessageEffects),
    HttpClientModule,
    FormsModule,
    MatMiniFabButton,
    MatButton,
    MatLabel,
    MatSelect,
    MatOption,
    MatCheckbox,
    MatFormField,
    MatChipRow,
    MatChipGrid,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatExpansionPanelContent,
    ReactiveFormsModule,
    MatChipInput,
    MatTooltip,
    SharedModule,
    MatTabGroup,
    MatTab,
    MatSlideToggle,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
