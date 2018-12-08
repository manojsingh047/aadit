import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { GoogleDriveService } from "../services/google-drive.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private googleDriveService: GoogleDriveService) {
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        request = request.clone({
            headers: new HttpHeaders({
                Authorization: `Bearer ${this.googleDriveService.getOauthToken()}`
            })
        });

        return next.handle(request);
    }
}