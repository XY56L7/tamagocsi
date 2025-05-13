import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CodingChallengesService } from '../../../services/coding-challenges.service';
import { TamagocsiService } from '../../../services/tamagocsi.service';
import { CodingChallenge, CodingLanguage } from '../../../coding-challenge.model';
import { LanguagePreferenceService } from '../../../services/language-preference.service';

@Component({
  selector: 'app-coding-challenge',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="code-challenge-container">
      <div class="challenge-display" *ngIf="!isLoading; else loadingTemplate">
        <div class="display-header">
          <h5 class="challenge-title">{{ currentChallenge?.title || 'Válassz programozási nyelvet' }}</h5>
          <div class="challenge-badges" *ngIf="currentChallenge">
            <span class="difficulty-badge" [ngClass]="getDifficultyClass()">{{ currentChallenge?.difficulty }}</span>
            <span class="language-badge">{{ currentChallenge?.language }}</span>
          </div>
        </div>
        
        <div class="language-selector">
          <p class="selector-title">Programozási nyelv:</p>
          <div class="language-buttons">
            <button
              *ngFor="let language of availableLanguages"
              class="language-button"
              [class.active]="language === selectedLanguage"
              (click)="selectLanguage(language)"
            >
              {{ getLanguageEmoji(language) }} {{ getLanguageName(language) }}
            </button>
          </div>
        </div>
        
        <ng-container *ngIf="currentChallenge; else noChallenge">
          <div class="challenge-description-box">
            <p class="description-text">{{ currentChallenge?.description }}</p>
            <span class="xp-reward">
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
                    <pre class="test-code">{{ test.input }}</pre>
                  </div>
                  <div class="test-output">
                    <span class="test-label">OUT:</span>
                    <pre class="test-code">{{ test.expectedOutput }}</pre>
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
        </ng-container>
        
        <ng-template #noChallenge>
          <div class="no-challenge">
            <div class="message">
              <p>Nincs elérhető feladat a kiválasztott nyelvhez.</p>
              <p>Kérjük, válassz másik programozási nyelvet!</p>
            </div>
          </div>
        </ng-template>
      </div>
      
      <ng-template #loadingTemplate>
        <div class="loading-container">
          <div class="loading-message">
            <div class="pixel-spinner"></div>
            <p>Feladat betöltése...</p>
          </div>
        </div>
      </ng-template>
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
      padding-bottom: 6px;
    }
    
    .display-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2px 8px;
      background-color: rgba(0, 0, 0, 0.2);
      border-bottom: 2px solid #333;
    }
    
    .challenge-title {
      font-family: 'Press Start 2P', cursive;
      font-size: 0.7rem;
      margin: 0;
      color: #333;
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .challenge-badges {
      display: flex;
      gap: 6px;
      flex-shrink: 0;
      margin-left: 8px;
    }
    
    .difficulty-badge,
    .language-badge {
      font-size: 0.6rem;
      padding: 2px 5px;
      border-radius: 3px;
      background-color: var(--color-tamagotchi-btn);
      color: #333;
      font-family: 'Press Start 2P', cursive;
      border: 1px solid #333;
    }
    
    .language-selector {
      padding: 2px 6px;
      border-bottom: 1px dotted #333;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }
    
    .selector-title {
      font-family: 'Press Start 2P', cursive;
      font-size: 0.6rem;
      margin: 0 8px 0 0;
      color: #333;
      flex-shrink: 0;
    }
    
    .language-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 3px;
      justify-content: flex-start;
      flex: 1;
    }
    
    .language-button {
      background-color: rgba(255, 255, 255, 0.5);
      border: 1px solid #333;
      border-radius: 3px;
      padding: 2px 5px;
      font-family: 'Press Start 2P', cursive;
      font-size: 0.55rem;
      cursor: pointer;
      transition: all 0.2s ease;
      flex: 0 0 auto;
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.7);
        transform: translateY(-2px);
      }
      
      &.active {
        background-color: #333;
        color: var(--color-tamagotchi-screen);
      }
    }
    
    .challenge-description-box {
      padding: 4px 8px;
      margin: 2px 6px 4px;
      background-color: rgba(255, 255, 255, 0.5);
      border: 1px dashed #333;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-height: 32px;
      max-height: 54px;
      overflow-y: auto;
    }
    
    .description-text {
      margin: 0;
      font-size: 0.75rem;
      color: #333;
      line-height: 1.2;
      flex: 1;
      overflow-y: auto;
    }
    
    .xp-reward {
      font-family: 'Press Start 2P', cursive;
      font-size: 0.6rem;
      color: #333;
      white-space: nowrap;
      display: flex;
      align-items: center;
      padding: 2px 6px;
      background-color: rgba(255, 255, 255, 0.5);
      border-radius: 3px;
      margin-left: 8px;
      border: 1px solid #333;
      flex-shrink: 0;
    }
    
    .challenge-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 0 6px 6px;
      overflow: hidden;
      height: calc(100% - 100px);
    }
    
    .code-sections {
      display: flex;
      flex-direction: row;
      gap: 8px;
      flex: 1;
      overflow: hidden;
      min-height: 65%;
    }
    
    .code-problem,
    .code-solution {
      background-color: rgba(255, 255, 255, 0.3);
      border: 1px solid #333;
      border-radius: 3px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      flex: 1;
      min-height: 100%;
    }
    
    .code-problem {
      flex: 0.9;
    }
    
    .code-solution {
      flex: 1.1;
      position: relative;
    }
    
    .pixel-panel-header {
      padding: 3px 6px;
      background-color: #333;
      color: var(--color-tamagotchi-screen);
      font-family: 'Press Start 2P', cursive;
      font-size: 0.6rem;
    }
    
    .panel-title {
      display: inline-block;
    }
    
    .code-block {
      flex: 1;
      margin: 0;
      padding: 8px;
      font-family: 'VT323', monospace;
      font-size: 0.95rem;
      background-color: rgba(0, 0, 0, 0.8);
      color: #33ff00;
      border: none;
      border-radius: 0;
      overflow: auto;
      line-height: 1.4;
      height: 100%;
      max-height: 100%;
      white-space: pre-wrap;
      word-break: break-word;
    }
    
    .code-textarea {
      flex: 1;
      height: calc(100% - 25px);
      resize: none;
      margin: 0;
      padding: 8px;
      font-family: 'VT323', monospace;
      font-size: 0.95rem;
      background-color: rgba(0, 0, 0, 0.8);
      color: #33ff00;
      border: none;
      outline: none;
      line-height: 1.4;
      white-space: pre-wrap;
    }
    
    .result-message {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 6px;
      text-align: center;
      font-family: 'Press Start 2P', cursive;
      font-size: 0.6rem;
      
      &.success {
        background-color: rgba(0, 255, 0, 0.3);
        color: #006400;
      }
      
      &.error {
        background-color: rgba(255, 0, 0, 0.3);
        color: #8b0000;
      }
      
      .result-icon {
        font-size: 0.85rem;
      }
    }
    
    .test-panel {
      width: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-height: 140px;
      max-height: 35%;
    }
    
    .test-cases-container {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
      background-color: rgba(255, 255, 255, 0.3);
      border-left: 1px solid #333;
      border-right: 1px solid #333;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-content: flex-start;
    }
    
    .test-case {
      flex: 1 1 45%;
      min-width: 180px;
      margin-bottom: 0;
      padding: 8px;
      background-color: rgba(255, 255, 255, 0.5);
      border-radius: 4px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
    
    .test-input,
    .test-output {
      margin-bottom: 8px;
      overflow: hidden;
      display: flex;
      align-items: flex-start;
    }
    
    .test-output {
      margin-bottom: 0;
    }
    
    .test-label {
      font-family: 'Press Start 2P', cursive;
      font-size: 0.55rem;
      margin-right: 8px;
      color: #333;
      display: inline-block;
      flex-shrink: 0;
      min-width: 24px;
    }
    
    .test-code {
      font-family: 'VT323', monospace;
      font-size: 0.85rem;
      background-color: rgba(0, 0, 0, 0.1);
      padding: 2px 4px;
      border-radius: 2px;
      flex: 1;
      overflow: hidden;
      word-break: break-all;
      white-space: pre-wrap;
      max-height: 60px;
      overflow-y: auto;
      margin: 0;
    }
    
    .test-actions {
      padding: 6px;
      background-color: rgba(255, 255, 255, 0.3);
      border: 1px solid #333;
      border-top: none;
      border-bottom-left-radius: 3px;
      border-bottom-right-radius: 3px;
    }
    
    .action-buttons {
      display: flex;
      justify-content: space-between;
      gap: 5px;
    }
    
    .pixel-button {
      font-family: 'Press Start 2P', cursive;
      font-size: 0.55rem;
      padding: 4px 6px;
      background-color: var(--color-tamagotchi-btn);
      border: 2px solid #333;
      border-radius: 3px;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
      flex: 1;
      text-align: center;
      
      &:hover {
        transform: translateY(-2px);
      }
      
      &:active {
        transform: translateY(0);
      }
    }
    
    .check-btn {
      background-color: rgba(0, 255, 0, 0.3);
    }
    
    .next-btn {
      background-color: rgba(0, 0, 255, 0.2);
    }
    
    .no-challenge {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 15px;
    }
    
    .message {
      text-align: center;
      font-family: 'Press Start 2P', cursive;
      font-size: 0.7rem;
      color: #333;
      line-height: 1.5;
      
      p {
        margin: 8px 0;
      }
    }
    
    .loading-container {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: var(--color-tamagotchi-screen-bg);
      border: 2px solid #333;
      border-radius: 6px;
    }
    
    .loading-message {
      text-align: center;
      
      p {
        font-family: 'Press Start 2P', cursive;
        font-size: 0.8rem;
        color: #333;
        margin-top: 12px;
      }
    }
    
    .pixel-spinner {
      width: 32px;
      height: 32px;
      margin: 0 auto;
      border: 3px solid rgba(0, 0, 0, 0.1);
      border-left: 3px solid #333;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* Responsive styles */
    @media (min-width: 1200px) {
      .language-buttons {
        justify-content: flex-start;
      }
      
      .code-block, 
      .code-textarea {
        font-size: 1.05rem;
      }
      
      .test-panel {
        min-height: 160px;
      }
      
      .test-code {
        font-size: 0.9rem;
        max-height: 70px;
      }
      
      .pixel-button {
        font-size: 0.6rem;
        padding: 5px 8px;
      }
    }
    
    @media (min-width: 1600px) {
      .challenge-title {
        font-size: 0.85rem;
      }
      
      .description-text {
        font-size: 0.9rem;
      }
      
      .language-button {
        font-size: 0.65rem;
        padding: 5px 10px;
      }
      
      .code-block, 
      .code-textarea {
        font-size: 1.1rem;
      }
      
      .test-code {
        font-size: 0.95rem;
      }
    }
    
    @media (max-width: 992px) {
      .code-sections {
        flex-direction: column;
      }
      
      .code-problem,
      .code-solution {
        max-height: none;
        min-height: 150px;
      }
      
      .test-panel {
        width: 100%;
        max-width: 100%;
        min-height: 140px;
      }
      
      .test-case {
        flex: 1 1 100%;
      }
    }
    
    @media (max-width: 768px) {
      .challenge-content {
        height: auto;
      }
      
      .code-sections {
        flex-direction: column;
        margin-bottom: 8px;
      }
      
      .code-problem,
      .code-solution {
        min-height: 120px;
      }
      
      .test-panel {
        max-height: none;
      }
      
      .test-cases-container {
        max-height: 200px;
      }
    }
    
    /* Doboz a tesztpanelen a teszteseteknek, hogy jobban kiemelkedjenek */
    .test-panel .pixel-panel-header {
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
    }
    
    .test-panel .test-actions {
      border-bottom-left-radius: 3px;
      border-bottom-right-radius: 3px;
    }
  `]
})
export class CodingChallengeComponent implements OnInit {
  currentChallenge: CodingChallenge | null = null;
  userSolution: string = '';
  showSuccess: boolean = false;
  showError: boolean = false;
  isLoading: boolean = false;
  availableLanguages: CodingLanguage[] = [];
  selectedLanguage: CodingLanguage = 'python';
  
  constructor(
    private challengesService: CodingChallengesService,
    private tamagocsiService: TamagocsiService,
    private languagePreference: LanguagePreferenceService
  ) {}
  
  ngOnInit(): void {
    this.isLoading = true;
    
    // Figyeljük a betöltési állapotot
    this.challengesService.loading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
    
    // Figyeljük a kiválasztott nyelvet
    this.languagePreference.selectedLanguage$.subscribe(language => {
      this.selectedLanguage = language;
    });
    
    // Figyeljük az aktuális feladatot
    this.challengesService.currentChallenge$.subscribe(challenge => {
      this.currentChallenge = challenge;
      if (challenge) {
        this.userSolution = '';
        this.showSuccess = false;
        this.showError = false;
      }
    });
    
    // Betöltjük az elérhető nyelveket
    setTimeout(() => {
      this.availableLanguages = this.challengesService.getAvailableLanguages();
      this.isLoading = false;
    }, 1000);
  }
  
  getNewChallenge(): void {
    this.isLoading = true;
    this.userSolution = '';
    this.showSuccess = false;
    this.showError = false;
    
    this.challengesService.getRandomChallenge()
      .subscribe(() => {
        this.isLoading = false;
      });
  }
  
  submitSolution(): void {
    if (!this.currentChallenge || !this.userSolution.trim()) return;
    
    const isCorrect = this.challengesService.validateSolution(
      this.currentChallenge,
      this.userSolution
    );
    
    if (isCorrect) {
      this.showSuccess = true;
      this.showError = false;
      
      // Adjunk XP-t a tamagocsinak
      this.tamagocsiService.addExperience(this.currentChallenge.experienceReward);
      
      // 3 mp múlva új feladat
      setTimeout(() => {
        this.getNewChallenge();
      }, 3000);
    } else {
      this.showError = true;
      this.showSuccess = false;
      
      // 2 mp múlva eltűnik a hibaüzenet
      setTimeout(() => {
        this.showError = false;
      }, 2000);
    }
  }
  
  selectLanguage(language: CodingLanguage): void {
    this.languagePreference.setLanguage(language);
  }
  
  getDifficultyClass(): string {
    if (!this.currentChallenge) return '';
    
    switch (this.currentChallenge.difficulty) {
      case 'easy': return 'easy';
      case 'medium': return 'medium';
      case 'hard': return 'hard';
      default: return '';
    }
  }
  
  getLanguageName(language: CodingLanguage): string {
    switch (language) {
      case 'python': return 'Python';
      case 'javascript': return 'JavaScript';
      case 'java': return 'Java';
      case 'cpp': return 'C++';
      case 'csharp': return 'C#';
      default: return language;
    }
  }
  
  getLanguageEmoji(language: CodingLanguage): string {
    switch (language) {
      case 'python': return '🐍';
      case 'javascript': return '📜';
      case 'java': return '☕';
      case 'cpp': return '🔍';
      case 'csharp': return '🎯';
      default: return '💻';
    }
  }
}