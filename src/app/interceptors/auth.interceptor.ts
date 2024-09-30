import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { finalize } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  currentRequests = 0;
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // console.log(request);

    // Showing loading state during any request
    if (!this.skipLoadingForRequest(request)) {
      this.currentRequests++;
      this.authService.loading.next(true);
    }

    request = request.clone({
      headers: request.headers.set('token', `${this.authService.token}`)
    });

    return next.handle(request).pipe(
      finalize(() => {
        if (!this.skipLoadingForRequest(request)) {
          this.currentRequests--;
        }
        if (this.currentRequests == 0) {
          this.authService.loading.next(false);
        }
      })
    );
  }

  skipLoadingForRequest(request: HttpRequest<unknown>) :boolean {
    let isSearchCoursesRequest = request.url.endsWith('CoursesFilter') && Object.keys(request.body).length > 0;
    let isSaveNameRequest = request.url.endsWith('CourseContents/Add');
    let isAddMedia = request.url.endsWith('ContentMedias/Add');
    let isUpdateContentPlayback = request.url.includes('PlaybackPosition');
    if (isSearchCoursesRequest || isSaveNameRequest || isAddMedia || isUpdateContentPlayback) {
      return true;
    }
    return false;
  }

}

