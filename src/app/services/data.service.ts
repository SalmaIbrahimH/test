import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ConnectionService } from './connection.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private connectionService: ConnectionService, private http: HttpClient) { }
  userAvatar = new BehaviorSubject<string>('assets/images/user.svg');

  getFieldData(isAdmin: boolean, fieldName: string, params?: {key: string, value}[]) {
    let httpParams = new HttpParams();
    if (params) {
      params.forEach(param => {
        httpParams = httpParams.append(param.key, param.value);
      });
    }

    // const httpParams: HttpParams = params ? new HttpParams().set(params.key, params.value) : new HttpParams();
    return this.connectionService.get(isAdmin, `/api/${fieldName}`, this.setHttpHeaders(isAdmin), httpParams);
  }
  getFieldDataById(isAdmin: boolean, fieldName: string, id, params?: {key: string, value}[]) {
    let httpParams = new HttpParams();
    if (params && params.length > 0) {
      params.forEach(param => {
        httpParams = httpParams.append(param.key, param.value);
      });
    }
    return this.connectionService.get(isAdmin, `/api/${fieldName}/${id}`, this.setHttpHeaders(isAdmin), httpParams);
  }
  addFieldData(isAdmin: boolean, fieldName: string, body, params?: {key: string, value}[]) {
    let httpParams = new HttpParams();
    if (params && params.length > 0) {
      params.forEach(param => {
        httpParams = httpParams.append(param.key, param.value);
      });
    }
    return this.connectionService.post(isAdmin, `/api/${fieldName}`, body, this.setHttpHeaders(isAdmin), httpParams);
  }
  updateFieldData(isAdmin: boolean, fieldName: string, body, id?) {
    const url = id ? `/api/${fieldName}/${id}` : `/api/${fieldName}`;
    return this.connectionService.put(isAdmin, url, body, this.setHttpHeaders(isAdmin));
  }
  deleteFieldData(isAdmin: boolean, fieldName: string, id?) {
    if (id) {
      return this.connectionService.delete(isAdmin, `/api/${fieldName}/${id}`, this.setHttpHeaders(isAdmin));
    } else {
      return this.connectionService.delete(isAdmin, `/api/${fieldName}`, this.setHttpHeaders(isAdmin));
    }
  }

  patchFieldData(isAdmin: boolean, fieldName: string, id, parameters) {
    return this.connectionService.patch(isAdmin, `/api/${fieldName}/${id}`, parameters, this.setHttpHeaders(true));
  }

  patchFieldDataWithQueryParam(isAdmin: boolean, fieldName: string, id, parameters) {
    return this.connectionService.patch(isAdmin, `/api/${fieldName}?id=${id}`, parameters, this.setHttpHeaders(true));
  }

  addContentMedias(isAdmin: boolean, body,) {
    return this.connectionService.postFile(isAdmin, `/api/v1/ContentMedias/Add`, body, this.setHttpHeaders(isAdmin));
  }

  export(isAdmin: boolean, fieldName: string, body) {
    return this.connectionService.postFile(isAdmin, `/api/${fieldName}`, body, this.setHttpHeaders(isAdmin));
  }

  setHttpHeaders(isAdmin?) {
    const httpHeaders = {
      "Accept": "application/json",
      // 'ApiKey': isAdmin ? environment.admin_api_key : environment.user_api_key,
    };
    return new HttpHeaders(httpHeaders);
  }

  getMaxSize() {
    return this.http.get('assets/size.json', {observe: 'response'}).pipe(
      map(res => res)
    )
  }
}
