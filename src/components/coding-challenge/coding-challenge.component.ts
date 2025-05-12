import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CodingChallengesService } from '../../services/coding-challenges.service';
import { TamagocsiService } from '../../services/tamagocsi.service';
import { CodingChallenge } from '../../coding-challenge.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-coding-challenge',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card challenge-card" *ngIf="currentChallenge">
      <div class="card-body">
        <h3 class="card-title">{{ currentChallenge.title }}</h3>
        <p class="card-text">{{ currentChallenge.description }}</p>
        
        <div class="challenge-details">
          <span class="badge bg-primary">Nehézség: {{ currentChallenge.difficulty }}</span>
          <span class="badge bg-secondary">Nyelv: {{ currentChallenge.language }}</span>
        </div>

        <div class="code-editor">
          <pre><code>{{ currentChallenge.code }}</code></pre>
          <textarea
            class="form-control"
            rows="10"
            [(ngModel)]="userSolution"
            placeholder="Írd ide a megoldásod..."
          ></textarea>
        </div>

        <div class="test-cases">
          <h4>Tesztesetek:</h4>
          <div class="test-case" *ngFor="let test of currentChallenge.testCases">
            <p><strong>Bemenet:</strong> {{ test.input }}</p>
            <p><strong>Várt kimenet:</strong> {{ test.expectedOutput }}</p>
          </div>
        </div>

        <div class="challenge-actions">
          <button class="btn btn-primary" (click)="submitSolution()">Megoldás beküldése</button>
          <button class="btn btn-secondary" (click)="getNewChallenge()">Új feladat</button>
        </div>

        <div class="alert alert-success" *ngIf="showSuccess">
          Gratulálok! A megoldásod helyes!
        </div>
        <div class="alert alert-danger" *ngIf="showError">
          Sajnos a megoldásod nem helyes. Próbáld újra!
        </div>
      </div>
    </div>
  `,
  styles: [`
    .challenge-card {
      max-width: 800px;
      margin: 20px auto;
      background-color: #f8f9fa;
      border: 2px solid #dee2e6;
      border-radius: 15px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .challenge-details {
      margin: 15px 0;
    }

    .badge {
      margin-right: 10px;
      font-size: 0.9em;
    }

    .code-editor {
      margin: 20px 0;
    }

    .code-editor pre {
      background-color: #272822;
      color: #f8f8f2;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 10px;
    }

    .code-editor textarea {
      font-family: 'Courier New', Courier, monospace;
      background-color: #f8f8f2;
      border: 1px solid #dee2e6;
      border-radius: 5px;
    }

    .test-cases {
      margin: 20px 0;
      padding: 15px;
      background-color: #e9ecef;
      border-radius: 5px;
    }

    .test-case {
      margin-bottom: 10px;
      padding: 10px;
      background-color: white;
      border-radius: 5px;
    }

    .challenge-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }

    .alert {
      margin-top: 20px;
    }
  `]
})
export class CodingChallengeComponent implements OnInit, OnDestroy {
  currentChallenge: CodingChallenge | null = null;
  userSolution: string = '';
  showSuccess: boolean = false;
  showError: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private challengesService: CodingChallengesService,
    private tamagocsiService: TamagocsiService
  ) {}

  ngOnInit(): void {
    this.getNewChallenge();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getNewChallenge(): void {
    this.userSolution = '';
    this.showSuccess = false;
    this.showError = false;
    
    this.subscription.add(
      this.challengesService.getRandomChallenge().subscribe({
        next: (challenge) => {
          this.currentChallenge = challenge;
        },
        error: (err) => {
          console.error('Hiba a kódolási feladat betöltésekor:', err);
        }
      })
    );
  }

  submitSolution(): void {
    if (!this.currentChallenge) return;

    const isCorrect = this.challengesService.validateSolution(
      this.currentChallenge,
      this.userSolution
    );

    if (isCorrect) {
      this.showSuccess = true;
      this.showError = false;
      this.tamagocsiService.addExperience(this.currentChallenge.experienceReward);
    } else {
      this.showSuccess = false;
      this.showError = true;
    }
  }
} 