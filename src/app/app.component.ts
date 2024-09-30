import { Component, AfterViewChecked, ChangeDetectorRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { DataService } from './services/data.service';
import { StateService } from './services/state.service';
import {Storage} from '@ionic/storage-angular';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements AfterViewChecked, OnInit {
  loading = false;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private dataService: DataService,
    private stateService: StateService,
    private router: Router,
    private storage: Storage
  ) {}

  async ngOnInit(): Promise<void> {
    this.authService.loading.subscribe(
      res => {
        this.loading = res
      }
    );

    if (this.authService.isLoggedin()) {
      let dataCiphertext = await this.storage.get(btoa('vLibrary'))as string;
      if (dataCiphertext) {
        let bytes  = CryptoJS.AES.decrypt(dataCiphertext, 'vLibrary@123'),
          decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        if (decryptedData.version != this.stateService.version) {
          this.authService.logout();
          return;
        }
        this.authService.token = decryptedData.userInfo.token
        // console.log(decryptedData.userInfo.token);

        this.authService.setUserInfo(decryptedData.userInfo);
        this.stateService.isAdmin.next(decryptedData?.userInfo?.role.includes('Admin') || false);

        // send request to update video position
        if (localStorage.getItem('updateVideoPlaybackPosition')) {
          let pbPositionData = JSON.parse(localStorage.getItem('updateVideoPlaybackPosition'));

          this.dataService.patchFieldDataWithQueryParam(false, 'v2/UserContentsHistories/PlaybackPosition', pbPositionData.id, pbPositionData.parameters)
          .subscribe(
            response => {
              localStorage.removeItem('updateVideoPlaybackPosition');
            }
          )
        }
      }
    }
  }

  ngAfterViewChecked(){
    //your code to btn-info the model
    this.cdr.detectChanges();
 }
}
