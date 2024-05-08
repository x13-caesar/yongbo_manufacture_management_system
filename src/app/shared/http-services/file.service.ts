import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  getPolicy(): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/token/oss_policy`)
  }

  uploadFileToOSS(fileToUpload: File,
                  key: string,
                  formData: FormData,
                  host: string): Observable<any> {
    // if (!fileToUpload) {console.log("No file selected!")};
    console.log(host);
    console.log(key);
    formData.append('key', key);
    formData.append('file', fileToUpload as any);
    console.log(formData);
    return this.http.post<any>(host, formData)
  }
}
