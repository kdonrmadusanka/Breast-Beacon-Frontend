// src/app/services/contact.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// Define a contact data interface
export interface ContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  institution?: string;
  role?: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Method to send contact form data to backend
  submitContactForm(data: ContactPayload): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log(headers);
    // console.log(data);
    return this.http
      .post<any>(`${this.apiUrl}/api/contact/`, data, { headers })
      .pipe(catchError(this.handleError));
  }

  // Handle API or network errors
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code ${error.status}, message: ${
        error.error?.message || error.message
      }`;
    }
    return throwError(() => errorMessage);
  }
}
