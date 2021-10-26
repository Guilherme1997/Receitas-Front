import { Injectable } from '@angular/core';
import { environment } from '../../../src/environments/environment';
import { HttpHeaders, HttpClient, HttpRequest } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CATCH_ERROR_VAR } from '@angular/compiler/src/output/output_ast';

@Injectable()
export class WebApiService {

    private httpHeaders: HttpHeaders;

    private endPoint: string = "https://localhost:5001/api/";

    constructor(public http: HttpClient) {
        this.httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }

    private handleError(error: Response | any) {

        let errorMessage: string;

        if (error instanceof Response) {

            const body = error.json() || "";

            errorMessage = error.status + " - " + error.statusText || "" + body
        }
        else {
            errorMessage = error.message ? error.message : error.toString();
        }

        return (error.error)
    }

    get(api: string): Observable<any> {

        return this.http.get(this.endPoint + api, { headers: this.httpHeaders })
            .pipe(
                catchError(this.errorCustomized)
            )

    }

    post(api: string, params: any): Observable<any> {

        let body = JSON.stringify(params);

        return this.http.post<any>(this.endPoint + api, body, { headers: this.httpHeaders })
            .pipe(
                catchError(this.errorCustomized)
            );
    }


    postResponseTypeText(api: string, params: any): Observable<any> {
        const requestOptions: Object = {
            headers: this.httpHeaders,
            responseType: 'text'
        }

        let body = JSON.stringify(params);

        return this.http.post<any>(this.endPoint + api, body,
            requestOptions)
            .pipe(
                catchError(this.errorCustomized)
            );
    }

    private errorCustomized(err): Observable<any> {

        if (err.status == 500) {
            return throwError(err);
        }

        if (err.status == 400) {
            return throwError(err);
        }

        return of([]);
    }

    deleteWithIdAndBody(api: string, param: any): Observable<any> {
        return this.http.request('DELETE', `${this.endPoint}${api}`,
            {
                headers: this.httpHeaders,
                body: param,
                responseType: 'text'
            }).pipe(
                catchError(this.handleError)
            );
    }

    delete(api: string, id: number) {
        return this.http
            .delete(this.endPoint + api + "/" + id, { headers: this.httpHeaders }).pipe(
                map((response: Response) => {
                    return response;
                }), catchError(this.errorCustomized)
            )
    }

    deleteWithOutId(api: String) {
        return this.http
            .delete(this.endPoint + api, { headers: this.httpHeaders }).pipe(
                map((response: Response) => {
                    return response;
                }), catchError(this.errorCustomized)
            )
    }

    put(api: String, param: any): Observable<any> {

        let body = JSON.stringify(param);

        return this.http.put(this.endPoint + api, body,
            { headers: this.httpHeaders }).pipe(
                map((response: Response) => {
                    return response;
                }), catchError(this.errorCustomized)
            )
    }

    putQueryString(api: String): Observable<any> {
        return this.http.put(this.endPoint + api,
            { headers: this.httpHeaders }).pipe(
                map((response: Response) => {
                    return response;
                }), catchError(this.errorCustomized)
            )
    }
}