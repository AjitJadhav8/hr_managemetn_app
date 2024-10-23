import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ceo',
  standalone: true,
  imports: [FormsModule,CommonModule,HttpClientModule],
  templateUrl: './ceo.component.html',
  styleUrl: './ceo.component.css'
})
export class CEOComponent implements OnInit {
  candidates: any[] = [];
  candidateStats: any = {}; // To hold summary statistics about candidates

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getCandidates();
  }

  getCandidates() {
    this.http.get<any[]>('http://localhost:3000/api/candidates').subscribe(
      (data) => {
        this.candidates = data;
        this.calculateCandidateStats(data);
      },
      (error) => {
        console.error('There was an error fetching the candidates!', error);
      }
    );
  }

  calculateCandidateStats(candidates: any[]) {
    const totalCandidates = candidates.length;
    const selected = candidates.filter(c => c.status === 'Selected').length;
    const rejected = candidates.filter(c => c.status === 'Rejected').length;

    this.candidateStats = {
      total: totalCandidates,
      selected: selected,
      rejected: rejected,
      onHold: candidates.filter(c => c.status === 'On Hold').length,
      joined: candidates.filter(c => c.status === 'Joined').length,
      offered: candidates.filter(c => c.status === 'Offered').length,
      candidateDrop: candidates.filter(c => c.status === 'Candidate Drop').length,
      interviewScheduled: candidates.filter(c => c.status === 'Interview is Scheduled').length
    };
  }
}