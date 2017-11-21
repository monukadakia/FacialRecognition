import { Component, OnInit } from '@angular/core';
import {AuthGuardService} from '../../services/auth-guard.service';
import {Router} from '@angular/router';
import {HeaderComponent} from '../../shared/header/header.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FirebaseApp} from 'angularfire2';
import {Http} from "@angular/http";
import 'firebase/storage';
import {FDFile} from "../../services/files.service";
import * as firebase from 'firebase/app';

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
  private done = false;
  private loading = false;
  private files: FDFile[];



  constructor(private authGuardService: AuthGuardService,
              private router: Router,
              private headerComponent: HeaderComponent,
              private modalService: NgbModal,
              private firebaseApp: FirebaseApp,
              private http: Http) {
    this.database = firebaseApp.database();
    this.storage = firebaseApp.storage();
    this.selected = 'home';
    this.files = [];
    
  }

  ngOnInit() {
    this.authGuardService.user.subscribe(a => {
      if (a === null) {
        this.router.navigate(['/login']);
      } else {
        this.userId = a.uid;
        this.authGuardService.afDB.list('/users/' + a.uid).subscribe(a2 => {
          this.files = [];
          a2.forEach( b => {
            let keys = Object.keys(b);
            keys.forEach(key => {
              if (key === "info") {
                this.headerComponent.updateUsername(b[key].firstName + " " + b[key].lastName);
              }
              if (b.$key === "files") {
                let fileDb = b[key];
                let fileKeys = Object.keys(b[key]);
                fileKeys.forEach( fileKey => {
                  let fdFile = new FDFile();
                  fdFile.deserialize(fileDb[fileKey]);
                  this.files.push(fdFile);
                });
              }
            });
          });
        });
      }
    });
  }

  startProcessing() {
    document.querySelector("video").src = "";
    this.done = false;
    this.loading = true;
    const file = ($('input[type=file]')[0] as HTMLInputElement).files[0];
    if (file) {
      this.getData(file.name);
    }
  }

  getData(file) {
    this.http.get('http://localhost:8888/FacialRecognition/FacialDetection/', {params: {fileInfo: file, userId: this.userId}})
      .subscribe(res => {
        console.log(res.text());
        // this.updateDatabase(file);
      });
  }

  updateDatabase(file){
    let fdFile = new FDFile();
    let hashed = (+new Date).toString(36);
    let dbHelper = this.database.ref("/users/" + this.userId + "/files/" + hashed);
    let fileJson = {
      id: hashed,
      name: file,
      filename: file,
      inputLink: "http://localhost:8888/FacialRecognition/FacialDetection/video_in/" + file,
      outputLink: "http://localhost:8888/FacialRecognition/FacialDetection/video_out/" + this.userId +"/"+ file
    };
    fdFile.deserialize(fileJson);
    dbHelper.push(fileJson).then( a => {
        // this.files.push(anFile);
      this.loading = false;
      document.querySelector("video").src = fdFile.outputLink;
    });
  }

  playFile(file, currentFile) {
    document.querySelector("video").src = file.outputLink;
    $(".file").each(function() {
      $(this).removeClass("selected");
    });
    $(".file").each(function() {
      if ($(this).html().includes(file.name)) {
        $(this).addClass("selected");
      }
    });
  }
}
