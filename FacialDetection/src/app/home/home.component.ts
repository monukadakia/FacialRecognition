import { Component, OnInit } from '@angular/core';
import {AuthGuardService} from '../../services/auth-guard.service';
import {Router} from '@angular/router';
import {HeaderComponent} from '../../shared/header/header.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FirebaseApp} from 'angularfire2';
import {Http} from "@angular/http";
import 'firebase/storage';
import {FDFile} from "../../services/files.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private userId;
  private storage;
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
            const keys = Object.keys(b);
            keys.forEach(key => {
              if (key === "info") {
                this.headerComponent.updateUsername(b[key].firstName + " " + b[key].lastName);
              }
              if (b.$key === "files") {
                const fileDb = b[key];
                const fileKeys = Object.keys(b[key]);
                fileKeys.forEach( fileKey => {
                  const fdFile = new FDFile();
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
    const hashed = (+new Date).toString(36);
    this.http.get('http://localhost:8888/FacialRecognition/FacialDetection/', {params: {fileInfo: file,
      userId: this.userId,
      videoId: hashed}})
      .subscribe(res => {
        console.log(res.text());
        this.updateDatabase(file, res.text(), hashed);
      });
  }

  updateDatabase(file, data, hashed) {
    const metadata = data.split("-----");   // all the output
    const video_data = metadata[0].split("\n");   // video_data
    const points_json = {};   // all the json
    let count = 1;
    metadata.forEach(x => {
      const currentData = x.split("\n");
      if (currentData.length >= 68) {
        const point = {};
        let i = 1;
        currentData.forEach(y => {
          if (y.trim().length > 0) {
            point["point " + i] = {
              x: y.split(" ")[0],
              y: y.split(" ")[1]
            };
            i++;
          }
        });
        points_json["frame " + count] = point;
        count++;
      }
    });
    const fdFile = new FDFile();

    const dbHelper = this.database.ref("/users/" + this.userId + "/files/" + hashed);
    const fileJson = {
      id: hashed,
      name: file,
      filename: file,
      inputLink: "http://localhost:8888/FacialRecognition/FacialDetection/video_in/" + file,
      outputLink: "http://localhost:8888/FacialRecognition/FacialDetection/video_out/" + this.userId + "/" + file,
      frames: video_data[0],
      fps: video_data[1],
      width: video_data[2],
      height: video_data[3],
      points: points_json
    };
    fdFile.deserialize(fileJson);
    dbHelper.push(fileJson).then( a => {
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
