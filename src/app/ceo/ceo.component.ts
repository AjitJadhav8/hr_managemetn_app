import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ceo',
  standalone: true,
  imports: [FormsModule,CommonModule,HttpClientModule],
  templateUrl: './ceo.component.html',
  styleUrl: './ceo.component.css'
})
export class CEOComponent implements OnInit {
  candidates: any[] = [];
  selectedCandidate: any = null;
  loggedInHR: string = '';


  constructor(private http: HttpClient, private router: Router,private dataService: DataService) {}

  ngOnInit(): void {
    this.getAllCandidates();
  }

  getAllCandidates() {
    this.dataService.getAllCandidates().subscribe(
      data => {
        // Filter for distinct candidates using the Candidate_ID to avoid duplicates
        this.candidates = this.getDistinctCandidates(data);
        console.log('Filtered candidates:', this.candidates);
      },
      error => {
        console.error('Error fetching candidates:', error);
      }
    );
  }

  getDistinctCandidates(data: any[]) {
    const distinctCandidates = new Map();
    data.forEach(candidate => {
      if (!distinctCandidates.has(candidate.Candidate_ID)) {
        distinctCandidates.set(candidate.Candidate_ID, candidate);
      }
    });
    return Array.from(distinctCandidates.values());
  }

  openModal(candidate: any) {
    this.dataService.getCandidateDetails(candidate.Candidate_ID).subscribe(
      data => {
        this.selectedCandidate = this.formatCandidateDetails(data);
      },
      error => {
        console.error('Error fetching candidate details:', error);
      }
    );
  }

  closeModal() {
    this.selectedCandidate = null;
  }

  formatCandidateDetails(data: any) {
    if (data.interviewRounds) {
      data.interviewRounds.forEach((round: { Interview_Date: string; }) => {
        round.Interview_Date = this.formatDate(round.Interview_Date);
      });
    }
    return data;
  }

  formatDate(dateString: string): string {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' } as const;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options); // 'en-GB' gives dd-mm-yyyy format
  }

  logout(){
    localStorage.removeItem('loggedInHR');
    localStorage.removeItem('loggedInHRId');
    console.log('Logged out successfully.');
    
    // Navigate to login page
    this.router.navigate(['/login']); // Redirect to HR dashboard for other users
  }

  
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showChangePasswordForm: boolean = false;


  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    const loggedInHRId = localStorage.getItem('loggedInHRId');
    if (!loggedInHRId) {
      alert("User ID is not valid.");
      return;
    }

    const changePasswordData = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    };

    this.dataService.changePassword(loggedInHRId, changePasswordData).subscribe(
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





}