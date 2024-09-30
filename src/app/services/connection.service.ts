import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StateService } from './state.service';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  // apiUrlPrefix: string;
  constructor(
    private http: HttpClient,
    private stateService: StateService,
    private router: Router,
    private storage: Storage
  ) {
    // this.stateService.isAdmin.subscribe(res => {
    //   this.apiUrlPrefix = res ? environment.admin_api_url_prefix : environment.user_api_url_prefix;
    // })
  }
  // apiUrlPrefix = environment.api_url_prefix;

  get(isAdmin: boolean, url: string, headers: HttpHeaders, params?: HttpParams) {
    const apiUrlPrefix = isAdmin ? environment.admin_api_url_prefix : environment.user_api_url_prefix;
    const opts = params ? { headers, params } : { headers };

    return this.http.get(apiUrlPrefix + url, opts)
      .pipe(catchError( err => this.handleError(url, err) ));
  }

  post(isAdmin: boolean, url: string, body: any, headers: HttpHeaders, params?: HttpParams) {
    const apiUrlPrefix = isAdmin ? environment.admin_api_url_prefix : environment.user_api_url_prefix;
    const opts = params ? { headers, params } : { headers };
    return this.http.post(apiUrlPrefix + url, body, opts)
      .pipe(catchError( err => this.handleError(url, err) ));
  }

  postFile(isAdmin: boolean, url: string, body: any, headers: HttpHeaders) {
    const apiUrlPrefix = isAdmin ? environment.admin_api_url_prefix : environment.user_api_url_prefix;
    return this.http.post(apiUrlPrefix + url, body, {
      observe: 'events',
      responseType: 'blob' as 'json',
      reportProgress: true,
      headers
    }).pipe(catchError( err => this.handleError(url, err) ));
  }

  put(isAdmin: boolean, url: string, body: any, headers: HttpHeaders) {
    const apiUrlPrefix = isAdmin ? environment.admin_api_url_prefix : environment.user_api_url_prefix;
    const opts = { headers };
    return this.http.put(apiUrlPrefix + url, body, opts)
      .pipe(catchError( err => this.handleError(url, err) ));
  }

  patch(isAdmin: boolean, url: string, parameters: any, headers: HttpHeaders) {
    const apiUrlPrefix = isAdmin ? environment.admin_api_url_prefix : environment.user_api_url_prefix;
    const opts = { headers };
    return this.http.patch(apiUrlPrefix + url, parameters, opts)
      .pipe(catchError( err => this.handleError(url, err) ));
  }

  delete(isAdmin: boolean, url: string, headers: HttpHeaders) {
    const apiUrlPrefix = isAdmin ? environment.admin_api_url_prefix : environment.user_api_url_prefix;
    const opts = { headers };
    return this.http.delete(apiUrlPrefix + url, opts)
      .pipe(catchError( err => this.handleError(url, err) ));
  }

  async handleError(url: string, err) {
    console.log(`${url} => `, err);
    if (typeof err.error == 'string') {
      err.error = JSON.parse(err.error);
    }
    if (err.error?.StatusCode == 302) {
      // this.toastr.warning('Please login', 'Your session has expired', {
      //   timeOut: 8000,
      //   extendedTimeOut: 8000
      // });
      // logout // can't use authService.logout() because of circular DI
      await this.storage.remove(btoa('vLibrary'))
      // localStorage.removeItem(btoa('vLibrary'));
      this.router.navigateByUrl('/auth');
      return throwError(err);
    }
    let errorMessage = err.error?.Message ? err.error.Message : '';
    console.log(errorMessage);

    // this.toastr.warning(errorMessage, 'Something went wrong', {
    //   timeOut: 8000,
    //   extendedTimeOut: 8000
    // });
    return throwError(err);
  }
}
