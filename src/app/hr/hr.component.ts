import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
interface Candidate {
  name: string;
  position: string;
  round_number: string;
  interviewer: string;
  interview_date: string;
  hr_name: string;
  status: string;
  remarks: string;
  candidateId?: number; // optional
}
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

  // Use the Candidate interface
  candidate: Candidate = {
    name: '',
    position: '',
    round_number: '',
    interviewer: '',
    interview_date: '',
    hr_name: this.loggedInHR,
    status: '',
    remarks: '',
    candidateId: undefined // Initialize candidateId
  };

  selectedCandidate: any = null;

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
    const candidateData = {
        ...this.candidate,
        u_id: this.loggedInHRId // Ensure the HR ID is passed from the logged-in context
    };

    this.http.post('http://localhost:3000/api/candidates', candidateData)
        .subscribe(
            response => {
                console.log('Candidate and interview round added:', response);
                // Handle success (reset form, show notifications, etc.)
            },
            error => {
                console.error('Error adding candidate:', error);
                // Handle error feedback to the user
            }
        );
}

  

  addNewInterviewRound() {
    // Ensure we have a selected candidate before adding a new interview round
    if (this.selectedCandidate) {
      const newRound = {
        ...this.selectedCandidate,
        round_number: (parseInt(this.selectedCandidate.round_number, 10) + 1).toString() // Increment the round number
      };

      // Update the candidate with the new round information
      this.http.put(`http://localhost:3000/api/candidates/${this.selectedCandidate.candidateId}`, newRound)
        .subscribe(
          () => {
            this.getCandidates(); // Refresh the candidates list
            this.resetForm(); // Reset the form after updating
          },
          (error: { message?: string }) => {
            console.error('There was an error adding the new interview round!', error.message || 'Unknown error');
          }
        );
    } else {
      console.error('No candidate selected to add a new interview round!');
    }
  }



  selectCandidate(candidate: any) {
    this.selectedCandidate = candidate;

    // Set the candidateId from the selected candidate
    this.candidate = {
      name: candidate.Candidate_Name || '',
      position: candidate.Position || '',
      round_number: candidate.Round_Number ? (parseInt(candidate.Round_Number, 10) + 1).toString() : '1', // Default to '1' if NaN
      interviewer: candidate.Interviewer || '',
      interview_date: candidate.Interview_Date || '', // Ensure this is in the correct format
      hr_name: this.loggedInHR,
      status: candidate.Status || '',
      remarks: candidate.Remarks || '',
      candidateId: candidate.Candidate_ID // This should now work
    } as Candidate; // Cast to Candidate type
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
      remarks: '',
      candidateId: undefined // Reset candidateId as well
    };
    this.selectedCandidate = null;
  }
}