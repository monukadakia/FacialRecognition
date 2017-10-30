import { Component, OnInit } from '@angular/core';
import {AuthGuardService} from '../../services/auth-guard.service';
import {Router} from '@angular/router';
import {HeaderComponent} from '../../shared/header/header.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FirebaseApp} from 'angularfire2';
import {Http} from "@angular/http";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private userId;
  private storage;
  private modal;
  private task;
  private database;
  private selected;
  private numberOfFrames;
  private loading = false;

  constructor(private authGuardService: AuthGuardService,
              private router: Router,
              private headerComponent: HeaderComponent,
              private modalService: NgbModal,
              private firebaseApp: FirebaseApp,
              private http: Http) {
    this.database = firebaseApp.database();
    this.selected = 'home';
  }

  ngOnInit() {
    this.authGuardService.user.subscribe(a => {
      if (a === null) {
        this.router.navigate(['/login']);
      } else {
        this.userId = a.uid;
        this.authGuardService.afDB.list('/users/' + a.uid).subscribe(a2 => {
          a2.forEach( b => {
            const keys = Object.keys(b);
            keys.forEach(key => {
              if (key === 'info') {
                this.headerComponent.updateUsername(b[key].name);
              }
            });
          });
        });
      }
    });
  }

  startProcessing() {
    this.numberOfFrames = null;
    this.loading = true;
    const file = ($('input[type=file]')[0] as HTMLInputElement).files[0];
    if (file) {
      this.getData(file.name);
    }
  }

  getData(file) {
    this.http.get('http://localhost:8888/FacialRecognition/FacialDetection/', {params: {fileInfo: file}})
      .subscribe(res => {
        console.log(res);
        this.numberOfFrames = res.text();
        this.loading = false;
      });
  }

}
