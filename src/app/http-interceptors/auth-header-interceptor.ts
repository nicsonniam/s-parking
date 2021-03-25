import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SpinnerService } from "../spinner/spinner.service";

@Injectable()
export class AuthHeaderInterceptor implements HttpInterceptor{
    constructor(private spinnerService: SpinnerService){}

    intercept(request: HttpRequest<any>, next: HttpHandler ){
        this.spinnerService.requestStarted();
        if(next.handle(request)){
            this.spinnerService.requestEnded();
        }
        return next.handle(request);
    }
}