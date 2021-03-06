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
  private facePoints = {};
  private pupilPoints = {};
  private posePoints = {};
  private video_data = [];
  private final_data = {};
  private frameCount = 0;


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

  get68Points(data) {
    const points = data.split(".....")[2];
    const pPoints = points.split("-----");
    let count = 0;
    pPoints.forEach(point => {
      let i = 1;
      const fpoint = {};
      point.split("\n").forEach(individual => {
        if (individual.trim().length > 0) {
          fpoint["Point " + i] = {
            x: individual.split(" ")[0],
            y: individual.split(" ")[1]
          };
          i++;
        }
      });
      if (fpoint["Point 1"]) {
        this.facePoints[count] = fpoint;
        count++;
      }
    });
    this.frameCount = count;
  }

  getPupilPoints(data) {
    const points = data.split(".....")[1];
    const pPoints = points.split("-----");
    let count = 0;
    pPoints.forEach(point => {
      const pupil_point = {};
      point.split("\n").forEach(pupil => {
        if (pupil.includes("Left:")) {
          pupil = pupil.replace("Left: ", "").replace(", ", " ").trim();
          pupil_point["Left Point"] = {
            x: pupil.split(" ")[0].trim(),
            y: pupil.split(" ")[1].trim()
          };
        } else if (pupil.includes("Right: ")) {
          pupil = pupil.replace("Right:", "").replace(", ", " ").trim();
          pupil_point["Right Point"] = {
            x: pupil.split(" ")[0].trim(),
            y: pupil.split(" ")[1].trim()
          };
        }
      });
      if (pupil_point["Left Point"]) {
        this.pupilPoints[count] = pupil_point;
        count++;
      }
    });
  }

  getPosePoints(data) {
    const points = data.split(".....")[3];
    const pPoints = points.split("-----");
    let count = 0;
    pPoints.forEach(point => {
      if (point.trim().length > 0) {
        const indPoint = point.split(" ");
        const pointData = {};
        pointData["Yaw"] = indPoint[0].trim();
        pointData["Pitch"] = indPoint[1].trim();
        pointData["Roll"] = indPoint[2].trim();
        this.posePoints[count] = pointData;
        count++;
      }
    });
  }

  getVideoData(data) {
    this.video_data = data.split(".....")[0].trim().split("\n");
  }

  mergeData() {
    for (let i = 0; i < this.frameCount; i++) {
      const points = {};
      points["68 Points"] = this.facePoints[i];
      if (this.pupilPoints[i]) {
        points["Pupil Points"] = this.pupilPoints[i];
      }
      if (this.posePoints[i]) {
        points["Head Position"] = this.posePoints[i];
      }
      this.final_data["Frame " + (i + 1)] = points;
    }
  }

  updateDatabase(file, data, hashed) {
    this.getVideoData(data);
    this.getPupilPoints(data);
    this.get68Points(data);
    this.getPosePoints(data);
    this.mergeData();
    const fdFile = new FDFile();

    const dbHelper = this.database.ref("/users/" + this.userId + "/files/" + hashed);
    const fileJson = {
      id: hashed,
      name: file,
      filename: file,
      inputLink: "http://localhost:8888/FacialRecognition/FacialDetection/video_in/" + file,
      outputLink: "http://localhost:8888/FacialRecognition/FacialDetection/video_out/" + this.userId + "/" + file,
      frames: this.video_data[0].trim(),
      fps: this.video_data[1].trim(),
      width: this.video_data[2].trim(),
      height: this.video_data[3].trim(),
      all_points: this.final_data
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
      if ($(this).html().includes(file.id)) {
        $(this).addClass("selected");
      }
    });
  }
}
