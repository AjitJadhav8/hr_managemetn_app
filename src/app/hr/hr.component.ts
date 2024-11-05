import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';

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

  constructor(private http: HttpClient, private router: Router,private dataService: DataService) {}

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




  currentSection: string = 'addCandidate'; // Show Add Candidate section by default

  showSection(section: string) {
    this.currentSection = section;
  }

  showAddRound: boolean = false;  // New property to control Add Round section visibility
  showUpdateCandidate: boolean = false; 

  selectCandidate(candidate: any) {
    this.selectedCandidate = candidate;
    this.newRound = {
      round_number: candidate.Round_Number ? (parseInt(candidate.Round_Number, 10) + 1).toString() : '1',
      interviewer: candidate.Interviewer || '',
      interview_date: candidate.Interview_Date || '',
      status: candidate.Status || '',
      remarks: candidate.Remarks || ''
    };

    // Reset the visibility flags
    this.showAddRound = false;
    this.showUpdateCandidate = false;
  }

  showAddRoundSection() {
    this.showAddRound = true;
    this.showUpdateCandidate = false; // Hide update section
  }

  showUpdateCandidateSection() {
    this.showUpdateCandidate = true;
    this.showAddRound = false; // Hide add round section
  }



  formatLocalDate(dateString: string): string {
    const date = new Date(dateString);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000; // Get the timezone offset in milliseconds
    return new Date(date.getTime() - userTimezoneOffset).toISOString().split('T')[0];
  }

  // getCandidates() {
  //   console.log('Fetching candidates for HR ID:', this.loggedInHRId);
  //   this.dataService.getCandidates(this.loggedInHRId)
  //     .subscribe(
  //       (data) => {
  //         this.candidates = data.map(candidate => {
  //           return {
  //             ...candidate,
  //             Interview_Date: candidate.Interview_Date ? this.formatLocalDate(candidate.Interview_Date) : 'N/A' // Set to 'N/A' if date is not present
  //           };
  //         });
  //         console.log('Fetched candidates:', this.candidates);
  //       },
  //       (error) => {
  //         console.error('There was an error fetching the candidates!', error.message || error);
  //       }
  //     );
  // }




  getCandidates() {
    console.log('Fetching candidates for HR ID:', this.loggedInHRId);
    
    this.dataService.getCandidates(this.loggedInHRId)
      .subscribe(
        (data) => {
          // Process candidates data to format the Interview_Date field
          this.candidates = data.map(candidate => ({
            ...candidate,
            Interview_Date: candidate.Interview_Date ? this.formatLocalDate(candidate.Interview_Date) : 'N/A' // Set to 'N/A' if date is not present
          }));
          
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

    this.dataService.addNewCandidate(candidateData)
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
      interview_date: this.formatLocalDate(this.newRound.interview_date), // Correct date handling
      c_id: this.selectedCandidate.Candidate_ID,
      status: this.newRound.status === 'Custom' ? this.newRound.customStatus : this.newRound.status // Use custom status if selected
    };

    this.dataService.addNewRound(this.selectedCandidate.Candidate_ID, roundData)
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


  // selectCandidate(candidate: any) {
  //   this.selectedCandidate = candidate;
  
  //   // Set the candidateId from the selected candidate
    
  //   // Update the form with selected candidate details
  //   this.newRound = {
  //     round_number: candidate.Round_Number ? (parseInt(candidate.Round_Number, 10) + 1).toString() : '1', // Default to '1' if NaN
  //     interviewer: candidate.Interviewer || '',
  //     interview_date: candidate.Interview_Date || '', // Ensure this is in the correct format
  //     status: candidate.Status || '',
  //     remarks: candidate.Remarks || ''
  //   };
  // }

  deleteInterviewRound(candidateId: number, roundNumber: string, candidateName: string) {
    const confirmDelete = confirm(`Are you sure you want to delete interview round ${roundNumber} for ${candidateName}?`);
    
    if (confirmDelete) {
      this.dataService.deleteInterviewRound(candidateId, roundNumber)
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
        name: this.selectedCandidate.Candidate_Name,
        position: this.selectedCandidate.Position
      };

      this.dataService.updateCandidate(this.selectedCandidate.Candidate_ID, updatedCandidate)
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
  
  logout(){
    localStorage.removeItem('loggedInHR');
    localStorage.removeItem('loggedInHRId');
    console.log('Logged out successfully.');
    
    // Navigate to login page
    this.router.navigate(['/login']); // Redirect to HR dashboard for other users
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

// In hr.component.ts
currentPassword: string = '';
newPassword: string = '';
confirmPassword: string = '';
showChangePasswordForm: boolean = false;

// Other methods...

changePassword() {
  if (this.newPassword !== this.confirmPassword) {
    alert("New passwords do not match!");
    return;
  }

  // Ensure loggedInHRId is a string
  if (!this.loggedInHRId) {
    alert("User ID is not valid.");
    return;
  }

  // Create changePasswordData without userId
  const changePasswordData = {
    currentPassword: this.currentPassword,
    newPassword: this.newPassword
  };

  // Call the dataService with both userId and changePasswordData
  this.dataService.changePassword(this.loggedInHRId as string, changePasswordData).subscribe(
    (response) => {
      alert("Password changed successfully!");
      this.showChangePasswordForm = false;
      this.resetChangePasswordForm();
    },
    (error) => {
      console.error('Error changing password:', error);
      alert("Failed to change password: " + (error.error?.message || "Unknown error"));
    }
  );
}


resetChangePasswordForm() {
  this.currentPassword = '';
  this.newPassword = '';
  this.confirmPassword = '';
}







showHistory: boolean = false; // Control the visibility of the history section
candidateHistory: any[] = []; // Holds the interview rounds history for the selected candidate

showHistorySection() {
  console.log("Showing history section for candidate:", this.selectedCandidate);
  this.showHistory = true;
  this.getCandidateHistory(this.selectedCandidate.Candidate_ID);
}

// Fetches all interview rounds for a selected candidate
getCandidateHistory(candidateId: number) {
  console.log("Fetching history for candidate ID:", candidateId);
  this.dataService.getInterviewRounds(candidateId).subscribe(
    (history) => {
      console.log("Interview history fetched:", history);
      this.candidateHistory = history.map(round => ({
        ...round,
        Interview_Date: round.Interview_Date ? this.formatLocalDate(round.Interview_Date) : 'N/A'
      }));
      console.log("Formatted candidate history:", this.candidateHistory);
    },
    (error) => {
      console.error("Error fetching interview history:", error);
    }
  );
}











}