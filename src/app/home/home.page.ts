import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { environment } from 'src/environments/environment';
import { ConnectionService } from '../services/connection.service';
import { AuthService } from '../services/auth.service';
import * as forge from 'node-forge';
import * as CryptoJS from 'crypto-js';
import { StateService } from '../services/state.service';
import {Storage} from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],

})
export class HomePage implements OnInit{
  step: string = 'step1';
  email: string="";
  password: string="";
  isLoggedIn: boolean = false; // Track if the user is logged in
  loginForm: FormGroup;
  isAdmin = false;
  publicKey = environment.public_key;

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  qrCodeValue = ``;
  selectedMode = null;
  showQR = false;
  showText = false;
  otp = '';
  phoneNumber = '';

  steps=[]
  activeIndex = 0;
  constructor(    private authService: AuthService,private storage:Storage,private toastController: ToastController,  private http: HttpClient, private router: Router, private connectionService: ConnectionService  , private stateService: StateService,)
  {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, ]),
      password: new FormControl('', [Validators.required])
    });
  }
  async ngOnInit(): Promise<void> {
    await this.storage.create();

    this.steps = [
      {
        label: 'Step 1',
        command: (event: any) => {
          console.log(event);
        }
      },
      {
        label: 'Step 2',
        command: (event: any) => {
          console.log(event);
        }
      },
    ];

    if (this.authService.isLoggedin()) {
      if (this.authService.userInfo?.role == 'Admin') {
        this.router.navigateByUrl('/admin')
      } else {
        this.router.navigateByUrl('/courses')
      }
    }
  }

  // goToStep2() {
  //   if (this.email && this.password) {
  //     // Simulate a login process
  //    // Move to step 2
  //   } else {
  //     alert('Please enter username and password');
  //   }
  // }

  onItemClick(item: string) {
    console.log(`${item} clicked`);
    alert(`${item} clicked`);
  }

  selectMode(id) {
    if (id == 1) {
      this.selectedMode = 1;
    } else {
      this.sendOtpAsText();
      this.selectedMode = 2;
    }
  }

  getOtp() {
    console.log('getotp');

    if (this.loginForm.valid) {
      const password = this.loginForm.value.password;
      const username = this.loginForm.value.username;
console.log(password,username)
      // Encypting password
      let rsa = forge.pki.publicKeyFromPem(this.publicKey);
      let encryptedPassword = window.btoa(rsa.encrypt(password));

      // Check authentication
      let body = {username: username, password: encryptedPassword};
      console.log(body);
      this.authService.getOtp(body).subscribe((res: any) => {
this.isLoggedIn = true;
        this.step = 'step2';
        console.log(res);
        this.phoneNumber = `xxxxxxxx${res.mobileNumber.substr(8)}`

        this.authService.loginToken = res.otptoken;
        this.activeIndex = 1;
        console.log(res.base32Key);

        this.qrCodeValue = `otpauth://totp/Vlibrary:${username}?secret=${res?.base32Key}&issuer=Vlibrary`
        console.log(this.qrCodeValue);
      },
      err=>{
        console.log(err.error.Message,'ERR')
        this.presentToast(err.error.Message)
      });
    }
  }

  login() {
    console.log(this.loginForm.valid , this.otp)
    if (this.loginForm.valid && this.otp) {
      // const password = this.loginForm.value.password;
      // const username = this.loginForm.value.username;

      // // Encypting password
      // let rsa = forge.pki.publicKeyFromPem(this.publicKey);
      // let encryptedPassword = window.btoa(rsa.encrypt(password));

      // Check authentication
      let body = {otpCode: this.otp, isSMS: this.selectedMode == 1 ? false : true};
      console.log(body);
      this.authService.login(body).subscribe((res: any) => {
        // console.log(res);
        const token = res.headers.get('Authorization');

        this.authService.token = token;
        this.setData(res.body, token);
        // redirect to last url after login
        // if (this.authService.redirectUrl) {
        //   if (this.authService.redirectUrl.includes('pages')) {
        //     this.stateService.switchUserRole('User');
        //   }
        //   this.router.navigate([this.authService.redirectUrl]);
        //   this.authService.redirectUrl = null;
        //   return;
        // }

        // if (res.body.roles.includes('Admin') || res.body.roles.includes('SuperAdmin')) {
        //   this.router.navigateByUrl('/auth/select-role');
        // } else {
          this.router.navigateByUrl('courses');
        // }
      }, err => {
        if (err.status == 302) {
          location.reload();
        }
      });
    }
  }
  setData(userInfo: any, token) {
    // new syntax => ...(condition) && { property: value } conditionally add property to object
    // this will add the property 'role' and set its value to currentUser['role'] only if there is a current user
    userInfo = {
      ...userInfo,
      token,
      ...(userInfo) && { role: userInfo?.roles?.includes('Admin') || userInfo?.roles?.includes('SuperAdmin') ? 'Admin' : 'User' },
      ...(userInfo) && { originalRole: userInfo?.roles?.includes('Admin') || userInfo?.roles?.includes('SuperAdmin') ? 'Admin' : 'User' },
    };
    this.authService.setUserInfo(userInfo);
    this.stateService.isAdmin.next((userInfo?.roles.includes('Admin') || userInfo?.roles?.includes('SuperAdmin')) || false);

    const lsData = {
      userInfo: userInfo,
      authenticated: true,
      // authorized: true, // TBD
      version: this.stateService.version
    };
    // console.log(lsData);

    let dataCiphertext = CryptoJS.AES.encrypt(JSON.stringify(lsData), 'vLibrary@123').toString();
    // localStorage.setItem(btoa('vLibrary'), dataCiphertext);
    this.storage.set(btoa('vLibrary'), dataCiphertext)
  }

  sendOtpAsText() {
    this.authService.sendOtpAsText().subscribe(res => {
      this.selectedMode = 2;
      console.log(res);
      // this.showToastService.showToast('success', 'Message sent!', '6 digit code sent to your phone');
    }, err => {
      if (err.status == 302) {
        location.reload();
      }
    })
  }
  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom',
      color:'danger'
    });
    await toast.present();

}}
