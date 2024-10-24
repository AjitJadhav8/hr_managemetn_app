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
  newRound: {
    round_number: string;
    interviewer: string;
    interview_date: string;
    status: string;
    remarks: string;
    customStatus?: string; // Add customStatus as optional
  } = {
    round_number: '',
    interviewer: '',
    interview_date: '',
    status: '',
    remarks: '',
    customStatus: '' // Initialize as an empty string
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


  formatLocalDate(dateString: string): string {
    const date = new Date(dateString);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000; // Get the timezone offset in milliseconds
    return new Date(date.getTime() - userTimezoneOffset).toISOString().split('T')[0];
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
              Interview_Date: candidate.Interview_Date ? this.formatLocalDate(candidate.Interview_Date) : 'N/A' // Set to 'N/A' if date is not present
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
  

// addNewRound() {
//   const roundData = {
//     ...this.newRound,
//     interview_date: this.formatLocalDate(this.newRound.interview_date), // Correct date handling
//     c_id: this.selectedCandidate.Candidate_ID
//   };

//   this.http.post(`http://localhost:3000/api/candidates/${this.selectedCandidate.Candidate_ID}/interview-rounds`, roundData)
//     .subscribe(
//       () => {
//         this.getCandidates(); // Refresh candidate list
//         this.newRound = { round_number: '', interviewer: '', interview_date: '', status: '', remarks: '' }; // Reset form
//       },
//       error => {
//         console.error('Error adding round:', error);
//       }
//     );
// }

addNewRound() {
  const roundData = {
    ...this.newRound,
    interview_date: this.formatLocalDate(this.newRound.interview_date), // Correct date handling
    c_id: this.selectedCandidate.Candidate_ID,
    status: this.newRound.status === 'Custom' ? this.newRound.customStatus : this.newRound.status // Use custom status if selected
  };

  this.http.post(`http://localhost:3000/api/candidates/${this.selectedCandidate.Candidate_ID}/interview-rounds`, roundData)
    .subscribe(
      () => {
        this.getCandidates(); // Refresh candidate list
        this.newRound = { round_number: '', interviewer: '', interview_date: '', status: '', remarks: '', customStatus: '' }; // Reset form
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

  deleteInterviewRound(candidateId: number, roundNumber: string, candidateName: string) {
    // Show confirmation dialog
    const confirmDelete = confirm(`Are you sure you want to delete interview round ${roundNumber} for ${candidateName}?`);
    
    if (confirmDelete) {
      this.http.delete(`http://localhost:3000/api/candidates/${candidateId}/interview-rounds/${roundNumber}`)
        .subscribe(
          (response) => {
            console.log('Interview round deleted:', response);
            this.getCandidates(); // Refresh candidate list after deletion
          },
          (error) => {
            console.error('There was an error deleting the interview round!', error);
          }
        );
    } else {
      console.log('Delete operation was canceled.');
    }
  }
  
  updateCandidate() {
    if (this.selectedCandidate) {
      const updatedCandidate = {
        name: this.selectedCandidate.Candidate_Name, // The updated name from the form
        position: this.selectedCandidate.Position    // The updated position from the form
      };
  
      this.http.put(`http://localhost:3000/api/candidates/${this.selectedCandidate.Candidate_ID}`, updatedCandidate)
        .subscribe(
          (response) => {
            console.log('Candidate updated:', response);
            this.getCandidates(); // Refresh the candidate list after updating
          },
          (error) => {
            console.error('Error updating candidate:', error);
          }
        );
    } else {
      console.error('No candidate selected for update.');
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