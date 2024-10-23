import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hr',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './hr.component.html',
  styleUrl: './hr.component.css'
})
export class HRComponent implements OnInit {
  loggedInHR: string = '';
  loggedInHRId: string | null = '';
  candidates: any[] = [];
  
  // Use a single object for candidate data
  candidate = {
    name: '',
    position: '',
    round_number: '',
    interviewer: '',
    interview_date: '',
    hr_name: this.loggedInHR,
    status: '',
    remarks: ''
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loggedInHR = localStorage.getItem('loggedInHR') || '';
    this.loggedInHRId = localStorage.getItem('loggedInHRId');
    console.log('Logged in HR:', this.loggedInHR);
    console.log('Logged in HR ID:', this.loggedInHRId);

    if (this.loggedInHRId) {
      this.getCandidates();
    } else {
      console.error('No HR is logged in!');
    }
  }

  getCandidates() {
    console.log('Fetching candidates for HR ID:', this.loggedInHRId);
    this.http
      .get<any[]>(`http://localhost:3000/api/candidates?u_id=${this.loggedInHRId}`)
      .subscribe(
        (data) => {
          this.candidates = data;
          console.log('Fetched candidates:', this.candidates);
        },
        (error) => {
          console.error('There was an error fetching the candidates!', error.message || error);
        }
      );
  }

  addOrUpdateCandidate() {
    this.candidate.name = this.candidate.name.toUpperCase();
    this.candidate.hr_name = this.loggedInHR;

    this.http.post('http://localhost:3000/api/candidates', this.candidate)
      .subscribe(
        (response) => {
          this.getCandidates();
          this.resetForm();
        },
        (error) => {
          console.error('There was an error adding the candidate!', error);
        }
      );
  }

  selectedCandidate: any = null;
  selectCandidate(candidate: any) {
    this.selectedCandidate = candidate;

    // Update the candidate object with the selected candidate's data
    this.candidate = {
      name: candidate.c_name,
      position: candidate.position,
      round_number: (parseInt(candidate.round_number, 10) + 1).toString(),
      interviewer: candidate.interviewer,
      interview_date: candidate.interview_date,
      hr_name: this.loggedInHR,
      status: candidate.status,
      remarks: candidate.remarks
    };
  }

  deleteCandidate(id: number) {
    this.http.delete(`http://localhost:3000/api/candidates/${id}`)
      .subscribe(
        (response) => {
          this.getCandidates();
        },
        (error) => {
          console.error('There was an error deleting the candidate!', error);
        }
      );
  }

  resetForm() {
    this.candidate = {
      name: '',
      position: '',
      round_number: '',
      interviewer: '',
      interview_date: '',
      hr_name: this.loggedInHR,
      status: '',
      remarks: ''
    };
    this.selectedCandidate = null;
  }
}
