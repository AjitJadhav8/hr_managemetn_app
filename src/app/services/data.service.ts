import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000'; 
  // private apiUrl = 'http://3.6.117.163:3000'; // Base URL for your API

  constructor(private http: HttpClient) {}

  // Fetch all candidates for CEO
  getAllCandidates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/all-candidates`);
  }

  // Get candidate details
  getCandidateDetails(candidateId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/candidates/${candidateId}/details`);
  }


    // Login method 
    login(credentials: { name: string; password: string }): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/api/login`, credentials);
    }

  // ********** Methods for HR Component **********
  getCandidates(u_id: string | null): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/candidates?u_id=${u_id}`);
  }

  // Add a new candidate
  // addNewCandidate(candidateData: { name: string; position: string; u_id: string | null }): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl}/api/candidates`, candidateData);
  // }


  addNewCandidateWithRound(candidateData: { name: string; position: string; u_id: string | null }, roundData: any): Observable<any> {
    const requestData = {
      candidate: candidateData,
      round: roundData
    };

    return this.http.post<any>(`${this.apiUrl}/api/candidates-with-round`, requestData);
  }









  // Add a new interview round
  addNewRound(c_id: number, roundData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/candidates/${c_id}/interview-rounds`, roundData);
  }

  // Delete an interview round
  deleteInterviewRound(candidateId: number, roundNumber: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/api/candidates/${candidateId}/interview-rounds/${roundNumber}`);
  }

  // Update a candidate's information
  updateCandidate(candidateId: number, updatedCandidate: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/api/candidates/${candidateId}`, updatedCandidate);
  }

// data.service.ts
changePassword(userId: string, changePasswordData: { currentPassword: string; newPassword: string }): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/api/change-password`, { userId, ...changePasswordData });
}


getInterviewRounds(candidateId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/api/interview_rounds/${candidateId}`);
}


  // Method to get interview options (positions, round numbers, interviewers, remarks, and statuses)
  getInterviewOptions(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/interview-options`);
  }

}