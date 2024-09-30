import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  // isAdmin = new BehaviorSubject(false);
  isAdmin = new BehaviorSubject(false);
  $courses = new BehaviorSubject([]);
  $course = new BehaviorSubject(null);
  $currentSection = new BehaviorSubject(null);
  $coursesType = new BehaviorSubject(1);
  $passedQuiz = new BehaviorSubject(false);
  version = 2;
  _storage: Storage;

  constructor(private router: Router,private storage: Storage) {   this.init();
  }
  async init() {
    // Initialize the storage before using it
    const storage = await this.storage.create();
    this._storage = storage;
  }
  getCourseById(id:any) {
    return this.$courses.getValue().find(course => course.id == id);
  }

  async switchUserRole(role:any) {
    this.isAdmin.next(role == 'Admin' ? true : false);
    // let dataCiphertext = localStorage.getItem(btoa('vLibrary')) as string;
    let dataCiphertext = await this._storage?.get(btoa('vLibrary') ) as string;

   
    if (dataCiphertext) {
      let bytes  = CryptoJS.AES.decrypt(dataCiphertext, 'vLibrary@123'),
      decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      // changing role in local storage
      decryptedData.userInfo.role = role == 'Admin' ? 'Admin' : 'User';
      // console.log(decryptedData);

      let dataCiphertextSet = CryptoJS.AES.encrypt(JSON.stringify(decryptedData), 'vLibrary@123').toString();

      // localStorage.setItem(btoa('vLibrary'), dataCiphertextSet);
      this._storage?.set(btoa('vLibrary'), dataCiphertextSet)
    }
    // this.router.navigateByUrl(role ? '/admin/courses' : '/pages/courses');
  }
}
