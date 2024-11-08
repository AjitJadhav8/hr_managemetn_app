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
export class HRComponent implements OnInit  {
  loggedInHR: string = '';
  loggedInHRId: string | null = '';
  candidates: any[] = [];


  selectedCandidate: any = null;

  constructor(private http: HttpClient, private router: Router, private dataService: DataService) { }

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

    // Fetch interview options for dropdowns
    this.dataService.getInterviewOptions().subscribe((data) => {
      this.interviewOptions = data;
      console.log('Interview Options:', this.interviewOptions);
    });
    this.getInterviewOptions();


  }

  getInterviewOptions() {
    this.dataService.getInterviewOptions().subscribe((data) => {
      this.interviewOptions = data;
      console.log('Interview Options:', this.interviewOptions);
    });
  }


  currentSection: string = 'addCandidate'; // Show Add Candidate section by default

  showSection(section: string) {
    this.currentSection = section;
  }

  showAddRound: boolean = false;  // New property to control Add Round section visibility
  showUpdateCandidate: boolean = false;

  selectCandidate(candidate: any) {
    this.selectedCandidate = candidate;
    // Reset the visibility flags
    this.showAddRound = false;
    this.showUpdateCandidate = false;
    this.showActionModal = true; // Show the modal when a candidate is selected

  }
  showActionModal: boolean = false;  // Add this line to declare the flag



  showAddRoundSection(candidate: any) {
    this.selectedCandidate = candidate; // Set the selected candidate for the add round form
    this.newRound = {
      round_number: candidate.Round_Number ? (parseInt(candidate.Round_Number, 10) + 1).toString() : '1',
      interviewer: '', 
      interview_date: '', 
      status: '', 
      remarks: '' 
    };
    this.showAddRound = true; 
    this.toggleAddRoundModal(); // Open the modal

  }
  toggleAddRoundModal() {
    this.showAddRoundModal = !this.showAddRoundModal; // Toggle modal visibility
  }
  showAddRoundModal = false;  // Initialize as false to hide the modal initially


  closeActionModal() {
    this.showActionModal = false;
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
          this.totalCandidates = this.candidates.length;  // Total number of candidates for pagination
          this.updatePageCandidates();
          console.log('Fetched candidates:', this.candidates);
        },
        (error) => {
          console.error('There was an error fetching the candidates!', error.message || error);
        }
      );
  }





  currentPage: number = 1;
  pageSize: number = 30;  // Number of candidates per page
  totalCandidates: number = 0;


  get paginatedCandidates() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = this.currentPage * this.pageSize;
    return this.candidates.slice(startIndex, endIndex);
  }

  // Function to go to the next page
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePageCandidates();
    }
  }

  // Function to go to the previous page
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePageCandidates();
    }
  }

  // Function to go to a specific page
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePageCandidates();
    }
  }

  // Calculate the total number of pages
  get totalPages() {
    return Math.ceil(this.totalCandidates / this.pageSize);
  }

  // Update the displayed candidates for the current page
  updatePageCandidates() {
    this.paginatedCandidates;
  }















  newCandidate: { name: string, position: string | undefined, customPosition?: string } = { name: '', position: undefined, customPosition: '' };

  // addNewCandidate() {
  //   // If position is 'Custom', assign customPosition to position
  //   if (this.isCustomPosition) {
  //     this.newCandidate.position = this.newCandidate.customPosition || ''; // Ensure position is a string (use empty string if undefined)
  //   }

  //   // Prepare the candidate data, making sure position is a valid string
  //   const candidateData = {
  //     name: this.newCandidate.name,
  //     position: this.newCandidate.position || '', // Provide an empty string if position is undefined
  //     u_id: this.loggedInHRId
  //   };

  //   // Call the service to add the new candidate
  //   this.dataService.addNewCandidate(candidateData).subscribe(
  //     response => {
  //       this.getCandidates(); // Refresh candidate list after adding
  //       this.getInterviewOptions();  // Refetch interview options for dropdowns

  //       this.newCandidate = { name: '', position: '', customPosition: '' }; // Reset form
  //       this.isCustomPosition = false; // Reset custom position flag



  //       // Show success alert
  //       this.showAlert('Candidate added successfully!', 'success');


  //     },
  //     error => {
  //       console.error('Error adding candidate:', error); // Log any error
  //       this.showAlert('Failed to add candidate. Please try again.', 'error');

  //     }
  //   );
  // }



  addNewCandidate() {
    // If position is 'Custom', assign customPosition to position
    if (this.isCustomPosition) {
      this.newCandidate.position = this.newCandidate.customPosition || ''; // Ensure position is a string
    }
  
    // Prepare candidate data
    const candidateData = {
      name: this.newCandidate.name,
      position: this.newCandidate.position || '',
      u_id: this.loggedInHRId
    };
  
    // Prepare round data
    const roundData = {
      round_number: this.newRound.round_number === 'Custom' ? this.newRound.customRoundNumber : this.newRound.round_number,
      interviewer: this.newRound.interviewer === 'Custom' ? this.newRound.customInterviewer : this.newRound.interviewer,
      interview_date: this.formatLocalDate(this.newRound.interview_date),
      status: this.newRound.status === 'Custom' ? this.newRound.customStatus : this.newRound.status,
      remarks: this.newRound.remarks
    };
  
    // Call the service to add both candidate and round
    this.dataService.addNewCandidateWithRound(candidateData, roundData).subscribe(
      response => {
        this.getCandidates(); // Refresh candidate list
        this.getInterviewOptions(); // Refetch interview options
        this.newCandidate = { name: '', position: '', customPosition: '' }; // Reset form
        this.newRound = { round_number: '', interviewer: '', interview_date: '', status: '', remarks: '', customRoundNumber: '', customInterviewer: '', customStatus: '' }; // Reset round form
        this.isCustomPosition = false; // Reset custom position flag
  
        // Show success alert
        this.showAlert('Candidate and Interview Round added successfully!', 'success');
      },
      error => {
        console.error('Error adding candidate with round:', error);
        this.showAlert('Failed to add candidate and round. Please try again.', 'error');
      }
    );
  }
  
















  addNewRound() {
    // Prepare final values for each field, using custom fields if selected as "Custom"
    const roundData = {
      round_number: this.newRound.round_number === 'Custom' ? this.newRound.customRoundNumber : this.newRound.round_number,
      interviewer: this.newRound.interviewer === 'Custom' ? this.newRound.customInterviewer : this.newRound.interviewer,
      interview_date: this.formatLocalDate(this.newRound.interview_date), // Adjust date formatting as needed
      status: this.newRound.status === 'Custom' ? this.newRound.customStatus : this.newRound.status,
      remarks: this.newRound.remarks,
      c_id: this.selectedCandidate.Candidate_ID // Candidate ID
    };

    // Send data to backend
    this.dataService.addNewRound(this.selectedCandidate.Candidate_ID, roundData)
      .subscribe(
        () => {
          this.showAlert('Interview round added successfully!', 'alert-success'); // Success alert

          this.getCandidates(); // Refresh candidate list
          this.getInterviewOptions(); // Refetch interview options for dropdowns

          this.newRound = { round_number: '', interviewer: '', interview_date: '', status: '', remarks: '', customRoundNumber: '', customInterviewer: '', customStatus: '' }; // Reset form
        },
        error => {
          console.error('Error adding round:', error);
          this.showAlert('Error adding interview round. Please try again.', 'alert-danger'); // Error alert

        }
      );
  }


  

  interviewOptions: any = {
    positions: [],
    roundNumbers: [],
    interviewers: [],
    remarks: [],
    statuses: [],
  };

  selectedStatus: string = '';
  isCustomStatus: boolean = false;  // Toggle for custom status input
  selectedPosition: string = '';
  isCustomPosition: boolean = false;  // Toggle for custom position input


  newRound: {
    round_number: string;
    customRoundNumber?: string;  // Optional custom round number
    interviewer: string;
    customInterviewer?: string;  // Optional custom interviewer
    interview_date: string;
    status: string;
    customStatus?: string;       // Optional custom status
    remarks: string;
  } = {
      round_number: '',
      customRoundNumber: '',  // Default to empty string
      interviewer: '',
      customInterviewer: '',  // Default to empty string
      interview_date: '',
      status: '',
      customStatus: '',       // Default to empty string
      remarks: ''
    };






  deleteInterviewRound(candidateId: number, roundNumber: string, candidateName: string) {
    const confirmDelete = confirm(`Are you sure you want to delete interview round ${roundNumber} for ${candidateName}?`);
  
    if (confirmDelete) {
      const encodedRoundNumber = encodeURIComponent(roundNumber); // Ensure round_number is URL-safe
  
      this.dataService.deleteInterviewRound(candidateId, encodedRoundNumber)
        .subscribe(
          (response) => {
            console.log('Interview round deleted:', response);
            this.getCandidates(); // Refresh candidate list after deletion
            this.getInterviewOptions(); // Refresh interview options after deleting a round
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
      // If position is 'Custom', assign customPosition to position
      if (this.isCustomPosition) {
        this.selectedCandidate.Position = this.selectedCandidate.customPosition || ''; // Ensure position is a string
      }

      const updatedCandidate = {
        name: this.selectedCandidate.Candidate_Name,
        position: this.selectedCandidate.Position || '', // Provide an empty string if position is undefined
      };

      this.dataService.updateCandidate(this.selectedCandidate.Candidate_ID, updatedCandidate)
        .subscribe(
          (response) => {
            console.log('Candidate updated:', response);
            this.showAlert('Candidate updated successfully!', 'alert-success'); // Success alert

            this.getCandidates(); // Refresh the candidate list after updating
          },
          (error) => {
            console.error('Error updating candidate:', error);
            this.showAlert('Error updating candidate. Please try again.', 'alert-danger'); // Error alert

          }
        );
    } else {
      console.error('No candidate selected for update.');
      this.showAlert('No candidate selected for update.', 'alert-warning'); // Warning alert if no candidate is selected

    }
  }

  logout() {
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

  
  openUpdateCandidateModal() {
    this.showUpdateCandidate = true;
  }

  // Close Update Candidate Modal
  closeUpdateCandidateModal() {
    this.showUpdateCandidate = false;
  }
  openHistoryModal() {
    this.showHistory = true;
  }

  // Close History Modal
  closeHistoryModal() {
    this.showHistory = false;
  }





// Component TypeScript file

// Variables for alert message and type
alertMessage: string | null = null;
alertType: string = 'alert-success'; // or any other class for styling

// Function to show alert
showAlert(message: string, type: string = 'alert-success') {
  this.alertMessage = message;
  this.alertType = type;
  
  // Hide alert after 3 seconds
  setTimeout(() => {
    this.alertMessage = null;
  }, 3000);
}

// Call this function where needed, e.g., after adding a new candidate










}