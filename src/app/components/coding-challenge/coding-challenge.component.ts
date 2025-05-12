import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CodingChallengesService } from '../../../services/coding-challenges.service';
import { TamagocsiService } from '../../../services/tamagocsi.service';
import { CodingChallenge } from '../../../coding-challenge.model';

@Component({
  selector: 'app-coding-challenge',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="code-challenge-container">
      <div class="challenge-display">
        <div class="display-header">
          <h5 class="challenge-title">{{ currentChallenge?.title || 'Loading...' }}</h5>
          <div class="challenge-badges">
            <span class="difficulty-badge" [ngClass]="getDifficultyClass()">{{ currentChallenge?.difficulty }}</span>
            <span class="language-badge">{{ currentChallenge?.language }}</span>
          </div>
        </div>
        
        <div class="challenge-description-box">
          <p class="description-text">{{ currentChallenge?.description }}</p>
          <span class="xp-reward" *ngIf="currentChallenge">
            +{{ currentChallenge.experienceReward }}XP
          </span>
        </div>
        
        <div class="challenge-content">
          <div class="code-sections">
            <div class="code-problem">
              <div class="pixel-panel-header">
                <div class="panel-title">Kezdeti kód</div>
              </div>
              <pre class="code-block"><code>{{ currentChallenge?.code }}</code></pre>
            </div>
            
            <div class="code-solution">
              <div class="pixel-panel-header">
                <div class="panel-title">Megoldásod</div>
              </div>
              <textarea
                class="code-textarea"
                [(ngModel)]="userSolution"
                placeholder="Írd ide a megoldásod..."
              ></textarea>
              
              <div class="result-message success" *ngIf="showSuccess">
                <span class="result-icon">✓</span> Helyes megoldás!
              </div>
              <div class="result-message error" *ngIf="showError">
                <span class="result-icon">✗</span> Helytelen megoldás
              </div>
            </div>
          </div>
          
          <div class="test-panel">
            <div class="pixel-panel-header">
              <div class="panel-title">Tesztesetek</div>
            </div>
            <div class="test-cases-container">
              <div class="test-case" *ngFor="let test of currentChallenge?.testCases">
                <div class="test-input">
                  <span class="test-label">IN:</span>
                  <code class="test-code">{{ test.input }}</code>
                </div>
                <div class="test-output">
                  <span class="test-label">OUT:</span>
                  <code class="test-code">{{ test.expectedOutput }}</code>
                </div>
              </div>
            </div>
            
            <div class="test-actions">
              <div class="action-buttons">
                <button class="pixel-button check-btn" (click)="submitSolution()">
                  Ellenőrzés
                </button>
                <button class="pixel-button next-btn" (click)="getNewChallenge()">
                  Új feladat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .code-challenge-container {
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    
    .challenge-display {
      height: 100%;
      flex: 1;
      background-color: var(--color-tamagotchi-screen-bg);
      border: 2px solid #333;
      border-radius: 6px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      padding-bottom: 8px;
    }
    
    .display-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 12px;
      background-color: rgba(0, 0, 0, 0.2);
      border-bottom: 2px solid #333;
    }
    
    .challenge-title {
      font-family: 'Press Start 2P', cursive;
      font-size: 0.85rem;
      margin: 0;
      color: #333;
    }
    
    .challenge-badges {
      display: flex;
      gap: 8px;
    }
    
    .difficulty-badge,
    .language-badge {
      font-size: 0.7rem;
      padding: 3px 6px;
      border-radius: 3px;
      background-color: var(--color-tamagotchi-btn);
      color: #333;
      font-family: 'Press Start 2P', cursive;
      border: 1px solid #333;
    }
    
    .challenge-description-box {
      padding: 8px 14px;
      margin: 8px;
      background-color: rgba(255, 255, 255, 0.5);
      border: 1px dashed #333;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .description-text {
      margin: 0;
      font-size: 0.9rem;
      color: #333;
      line-height: 1.4;
    }
    
    .xp-reward {
      font-family: 'Press Start 2P', cursive;
      font-size: 0.7rem;
      color: #333;
      white-space: nowrap;
      display: flex;
      align-items: center;
      padding: 3px 8px;
      background-color: rgba(255, 255, 255, 0.5);
      border-radius: 3px;
      margin-left: 12px;
      border: 1px solid #333;
    }
    
    .challenge-content {
      flex: 1;
      display: flex;
      gap: 8px;
      padding: 0 8px 8px;
      overflow: hidden;
      height: 100%;
    }
    
    .code-sections {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      height: 100%;
    }
    
    .code-problem,
    .code-solution {
      background-color: rgba(255, 255, 255, 0.3);
      border: 1px solid #333;
      border-radius: 3px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    
    .code-problem {
      flex: 1;
      margin-bottom: 8px;
    }
    
    .code-solution {
      flex: 1.5;
      position: relative;
    }
    
    .pixel-panel-header {
      padding: 4px 8px;
      background-color: #333;
      color: var(--color-tamagotchi-screen);
      font-family: 'Press Start 2P', cursive;
      font-size: 0.65rem;
    }
    
    .panel-title {
      display: inline-block;
    }
    
    .code-block {
      flex: 1;
      margin: 0;
      padding: 8px;
      font-family: 'VT323', monospace;
      font-size: 1.1rem;
      background-color: rgba(0, 0, 0, 0.8);
      color: #33ff00;
      border: none;
      border-radius: 0;
      overflow: auto;
      line-height: 1.4;
    }
    
    .code-textarea {
      flex: 1;
      height: calc(100% - 25px);
      resize: none;
      margin: 0;
      padding: 8px;
      font-family: 'VT323', monospace;
      font-size: 1.1rem;
      background-color: rgba(0, 0, 0, 0.8);
      color: #33ff00;
      border: none;
      outline: none;
      line-height: 1.4;
    }
    
    .test-panel {
      width: 33%;
      display: flex;
      flex-direction: column;
      background-color: rgba(255, 255, 255, 0.3);
      border: 1px solid #333;
      border-radius: 3px;
      overflow: hidden;
      justify-content: space-between;
    }
    
    .test-cases-container {
      flex: 1;
      padding: 3px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 3px;
      max-height: calc(100% - 70px);
    }
    
    .test-case {
      background-color: rgba(255, 255, 255, 0.2);
      border: 1px solid #333;
      border-radius: 3px;
      margin-bottom: 3px;
      padding: 3px;
    }
    
    .test-input,
    .test-output {
      display: flex;
      align-items: center;
      margin-bottom: 3px;
    }
    
    .test-label {
      font-family: 'Press Start 2P', cursive;
      font-size: 0.6rem;
      margin-right: 5px;
      color: #333;
      width: 32px;
    }
    
    .test-code {
      font-family: 'VT323', monospace;
      font-size: 0.9rem;
      color: #333;
      background-color: rgba(255, 255, 255, 0.5);
      padding: 2px 4px;
      border-radius: 2px;
      display: inline-block;
      word-break: break-all;
    }
    
    .test-actions {
      padding: 3px;
      border-top: 1px dashed #333;
      margin-top: auto;
    }
    
    .result-message {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 2px 4px;
      font-size: 0.7rem;
      text-align: center;
      z-index: 10;
    }
    
    .result-icon {
      font-weight: bold;
      margin-right: 3px;
    }
    
    .success {
      background-color: rgba(99, 255, 132, 0.8);
      border-top: 1px solid #28a745;
      color: #1e7e34;
    }
    
    .error {
      background-color: rgba(255, 99, 132, 0.8);
      border-top: 1px solid #dc3545;
      color: #dc3545;
    }
    
    .action-buttons {
      display: flex;
      justify-content: space-between;
    }
    
    .pixel-button {
      padding: 2px 5px;
      border-radius: 3px;
      font-family: 'Press Start 2P', cursive;
      font-size: 0.5rem;
      border: 1px solid #333;
      cursor: pointer;
      transition: all 0.1s ease;
      
      &:hover {
        transform: translateY(-1px);
      }
      
      &:active {
        transform: translateY(1px);
      }
    }
    
    .check-btn {
      background-color: var(--color-tamagotchi-btn);
      color: #333;
      box-shadow: 0 1px 0 #d9a400;
      
      &:active {
        box-shadow: 0 0 0 #d9a400;
      }
    }
    
    .next-btn {
      background-color: #36a9e1;
      color: white;
      box-shadow: 0 1px 0 #1e88c9;
      
      &:active {
        box-shadow: 0 0 0 #1e88c9;
      }
    }
    
    .bg-success {
      background-color: #33cc33 !important;
    }
    
    .bg-warning {
      background-color: #ff9900 !important;
    }
    
    .bg-danger {
      background-color: #ff3333 !important;
    }
    
    @media (max-height: 700px) {
      .description-text {
        font-size: 0.6rem;
      }
      
      .challenge-description-box {
        padding: 2px 5px;
      }
      
      .code-block, .code-textarea {
        font-size: 0.7rem;
      }
      
      .test-case {
        padding: 2px;
        margin-bottom: 2px;
      }
      
      .test-code {
        font-size: 0.6rem;
      }
    }
  `]
})
export class CodingChallengeComponent implements OnInit {
  currentChallenge: CodingChallenge | null = null;
  userSolution: string = '';
  showSuccess: boolean = false;
  showError: boolean = false;

  constructor(
    private challengesService: CodingChallengesService,
    private tamagocsiService: TamagocsiService
  ) {}

  ngOnInit(): void {
    this.getNewChallenge();
  }

  getNewChallenge(): void {
    this.challengesService.getRandomChallenge().subscribe(challenge => {
      this.currentChallenge = challenge;
      this.userSolution = '';
      this.showSuccess = false;
      this.showError = false;
    });
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
  
  getDifficultyClass(): string {
    if (!this.currentChallenge) return 'bg-secondary';
    
    switch(this.currentChallenge.difficulty.toLowerCase()) {
      case 'easy': return 'bg-success';
      case 'medium': return 'bg-warning';
      case 'hard': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}