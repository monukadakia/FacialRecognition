import {Observable} from "rxjs/Observable";
import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import * as firebase from "firebase/app";
import { Injectable } from '@angular/core';
import { FirebaseApp } from "angularfire2";

@Injectable()
export class FilesService {
  userId;
  items: FirebaseListObservable<any[]>;
  database;
  storage;

  constructor(public afAuth: AngularFireAuth,
              public afDB: AngularFireDatabase,
              public firebaseApp: FirebaseApp) {
    this.items = afDB.list('/users', {
    });
    this.afAuth.authState.subscribe(a => {
      this.userId = a.uid;
    });
    this.database = firebaseApp.database();
    this.storage = firebaseApp.storage();
  }

  updateFile(file) {
    let secretKey;
    this.afDB.list("/users/" + this.userId + "/files/" + file.id).subscribe(a => {
      let keys = Object.keys(a);
      secretKey = a[keys[0]].$key;
    });
    let db = this.database.ref("/users/" + this.userId + "/files/" + file.id + "/" + secretKey);
    return db.update(file);
  }

  removeData(data) {
    return this.database.ref("/users/" + this.userId + "/files/" + data.id).remove();
  }

  removeFile(file) {
    let ref = this.storage.ref();
    let fileName = file.filename.replace(".mp4", "");
    return ref.child(this.userId + "/" + fileName).delete();
  }

  getFile(id) {
    return this.afDB.list("/users/" + this.userId + "/files/" + id);
  }
}

export class FDFile {
  public id;
  public inputLink;
  public outputLink;
  public name;
  public filename;

  constructor(){
  }

  public deserialize(json) {
    this.id = json.id;
    this.name = json.name;
    this.inputLink = json.inputLink;
    this.outputLink = json.outputLink;
    this.filename = json.filename;
  }

}