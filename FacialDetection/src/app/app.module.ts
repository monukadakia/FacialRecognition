import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {RouterModule} from '@angular/router';
import { AngularFireModule } from 'angularfire2';

// New imports to update based on AngularFire2 version 4
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AuthGuardService} from '../services/auth-guard.service';
import {NgbModal, NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {HomeComponent} from './home/home.component';
import {HeaderComponent} from '../shared/header/header.component';
import {NgbModalStack} from '@ng-bootstrap/ng-bootstrap/modal/modal-stack';

export const firebaseConfig = {
  apiKey: 'AIzaSyDDKIAwjvd6fUtd_2mkF9ZlA1zM_py5a-w',
  authDomain: 'facialdetection-8f8b3.firebaseapp.com',
  databaseURL: 'https://facialdetection-8f8b3.firebaseio.com',
  projectId: 'facialdetection-8f8b3',
  storageBucket: 'facialdetection-8f8b3.appspot.com',
  messagingSenderId: '743206176190'
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: '', redirectTo: '/login' , pathMatch: 'full'},
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent},
      { path: 'home', component: HomeComponent}
    ]),
    FormsModule,
    HttpModule,
    NgbModalModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [AuthGuardService, HeaderComponent, NgbModal, NgbModalStack],
  bootstrap: [AppComponent]
})
export class AppModule { }
