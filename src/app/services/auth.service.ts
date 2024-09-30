import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ConnectionService } from './connection.service';
import * as CryptoJS from 'crypto-js';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loading = new BehaviorSubject(false);
  userInfo: any = null;
  token = '';
  loginToken = '';
  redirectUrl = null;

  constructor(private http: HttpClient, private router: Router, private connectionService: ConnectionService,private storage: Storage) {
  }

  async isLoggedin() {
    // let dataCiphertext = localStorage.getItem(btoa('vLibrary')) as string;
    let dataCiphertext = await this.storage.get(btoa('vLibrary'))as string;
    if (dataCiphertext) {
      let bytes  = CryptoJS.AES.decrypt(dataCiphertext, 'vLibrary@123'),
      decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      // console.log(new Date());
      // console.log(new Date(decryptedData?.userInfo?.expiresOn));
    console.log(decryptedData.userInfo.token,"data in local")

      // let authorized = decryptedData?.userInfo?.token && new Date().getTime() < new Date(decryptedData?.userInfo?.expiresOn).getTime();
      let authorized = decryptedData.userInfo.token;
      let authenticated = decryptedData.userInfo.isAuthenticated;
      return !!authenticated && !!authorized;
    }
console.log("here?")
    return false;
  }

  login(body: any) {
    return this.http.post(environment.user_api_url_prefix +`/api/v5/LogIn/AuthrizationStepTwo`, body, {observe: 'response', headers: new HttpHeaders({otptoken: `${this.loginToken}`})})
      .pipe(catchError( err => this.handleError(`/api/v5/LogIn/AuthrizationStepTwo`, err) ));
  }

  getOtp(body: any) {
    return this.http.post(environment.user_api_url_prefix +`/api/v5/LogIn/AuthrizationStepOne`, body)
      .pipe(catchError( err => this.handleError(`/api/v5/LogIn/AuthrizationStepOne`, err) ));
  }

  sendOtpAsText() {
    return this.http.post(environment.user_api_url_prefix +`/api/v5/SMS/sendOtpCode`, {}, {headers: new HttpHeaders({otptoken: `${this.loginToken}`})})
      .pipe(catchError( err => this.handleError(`/api/v5/SMS/sendOtpCode`, err) ));
  }


  getAuthorizedUsers() {
    return this.http.get(`assets/users.json`,
    { observe: 'response', headers: new HttpHeaders({'Content-Type': 'application/json',}) });
  }

  setUserInfo(userInfo: any) {
    this.userInfo = userInfo;
  }

  async logout() {
    // localStorage.removeItem(btoa('vLibrary'));
    await this.storage.remove(btoa('vLibrary'))
    this.router.navigateByUrl('/auth');
    this.loginToken = null;
  }

  handleError(url:string, err) {
    console.log(`${url} => `, err);
    if (typeof err.error == 'string') {
      err.error = JSON.parse(err.error);
    }
    let errorMessage = err.error?.Message ? err.error.Message : '';
    console.log(errorMessage);

    // this.toastr.warning(errorMessage, 'Something went wrong', {
    //   timeOut: 8000,
    //   extendedTimeOut: 8000
    // });
    return throwError(err);
  }

  setHttpHeaders() {
    const httpHeaders = {
      // 'ApiKey': environment.admin_api_key,
      observe: 'response'
    };
    return new HttpHeaders(httpHeaders);
  }
}
