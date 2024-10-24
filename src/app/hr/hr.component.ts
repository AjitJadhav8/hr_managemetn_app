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

  // Candidate form
  newCandidate: { name: string, position: string } = { name: '', position: '' };
  
  // Interview round form
  newRound: { round_number: string, interviewer: string, interview_date: string, status: string, remarks: string } = {
    round_number: '',
    interviewer: '',
    interview_date: '',
    status: '',
    remarks: ''
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


  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Convert to yyyy-mm-dd
  }


  getCandidates() {
    console.log('Fetching candidates for HR ID:', this.loggedInHRId);
    this.http
      .get<any[]>(`http://localhost:3000/api/candidates?u_id=${this.loggedInHRId}`)
      .subscribe(
        (data) => {
          this.candidates = data.map(candidate => {
            return {
              ...candidate,
              Interview_Date: this.formatDate(candidate.Interview_Date) // Format date here
            };
          });
          console.log('Fetched candidates:', this.candidates);
        },
        (error) => {
          console.error('There was an error fetching the candidates!', error.message || error);
        }
      );
  }

  addNewCandidate() {
    const candidateData = {
      name: this.newCandidate.name,
      position: this.newCandidate.position,
      u_id: this.loggedInHRId
    };

    this.http.post('http://localhost:3000/api/candidates', candidateData)
      .subscribe(
        response => {
          this.getCandidates(); // Refresh candidate list
          this.newCandidate = { name: '', position: '' }; // Reset form
        },
        error => {
          console.error('Error adding candidate:', error);
        }
      );
  }
  

addNewRound() {
  const roundData = {
    ...this.newRound,
    c_id: this.selectedCandidate.Candidate_ID
  };

  this.http.post(`http://localhost:3000/api/candidates/${this.selectedCandidate.Candidate_ID}/interview-rounds`, roundData)
    .subscribe(
      () => {
        this.getCandidates(); // Refresh candidate list
        this.newRound = { round_number: '', interviewer: '', interview_date: '', status: '', remarks: '' }; // Reset form
      },
      error => {
        console.error('Error adding round:', error);
      }
    );
}



  selectCandidate(candidate: any) {
    this.selectedCandidate = candidate;

    // Set the candidateId from the selected candidate
    
    // Update the form with selected candidate details
    this.newRound = {
      round_number: candidate.Round_Number ? (parseInt(candidate.Round_Number, 10) + 1).toString() : '1', // Default to '1' if NaN
      interviewer: candidate.Interviewer || '',
      interview_date: candidate.Interview_Date || '', // Ensure this is in the correct format
      status: candidate.Status || '',
      remarks: candidate.Remarks || ''
    };
  }

  deleteCandidate(id: number) {
    // Show confirmation dialog
    const confirmDelete = confirm('Are you sure you want to delete this candidate?');
    
    if (confirmDelete) {
      this.http.delete(`http://localhost:3000/api/candidates/${id}`)
        .subscribe(
          (response) => {
            this.getCandidates(); // Refresh candidate list after deletion
          },
          (error) => {
            console.error('There was an error deleting the candidate!', error);
          }
        );
    } else {
      console.log('Delete operation was canceled.');
    }
  }
  

  resetForm() {
    this.newRound = {
      round_number: '',
      interviewer: '',
      interview_date: '',
      status: '',
      remarks: ''
    };
    this.selectedCandidate = null;
  }
}