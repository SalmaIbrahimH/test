import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ShowToastService {

  constructor(private toastr: ToastrService) { }

  showToast(severity, summary, detail, time?) {
    // Severity => error, warning, success, info
    this.toastr.show(detail, summary, {
      timeOut: time ? time : 8000,
      extendedTimeOut: 3000,
      toastClass: `ngx-toastr override-toast toast-${severity}`,
    });
  }
}
