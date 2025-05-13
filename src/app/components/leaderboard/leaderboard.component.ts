import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardService } from '../../../services/leaderboard.service';
import { Leaderboard, LeaderboardEntry } from '../../../leaderboard.model';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="leaderboard-container">
      <div class="leaderboard-header">
        <h2 class="leaderboard-title">Heti Rangsor</h2>
        <div class="date-range">
          {{ formatDate(leaderboard.weekStartDate) }} - {{ formatDate(leaderboard.weekEndDate) }}
        </div>
      </div>
      
      <div class="leaderboard-content">
        <div class="top-players" *ngIf="leaderboard.entries.length > 0; else noPlayers">
          <div class="player-row header">
            <div class="rank">Helyezés</div>
            <div class="name">Játékos</div>
            <div class="points">Pont</div>
          </div>
          
          <div class="player-row" *ngFor="let entry of leaderboard.entries; let i = index" [class.current-user]="isCurrentUser(entry)">
            <div class="rank">{{ i + 1 }}</div>
            <div class="name">{{ entry.username }}</div>
            <div class="points">{{ entry.points }}</div>
          </div>
        </div>
        
        <ng-template #noPlayers>
          <div class="no-data">
            <p>Még nincs játékos a rangsorban ezen a héten.</p>
            <p>Oldj meg kódolási feladatokat pontokért!</p>
          </div>
        </ng-template>
      </div>
      
      <div class="leaderboard-actions">
        <button class="regenerate-button" (click)="regenerateLeaderboard()">
          <span class="icon">⟳</span> Új szimuláció
        </button>
      </div>
    </div>
  `,
  styles: [`
    .leaderboard-container {
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      background-color: var(--color-tamagotchi-screen-bg);
      border: 2px solid #333;
      border-radius: 6px;
    }
    
    .leaderboard-header {
      padding: 8px 12px;
      border-bottom: 2px dotted #333;
      background-color: rgba(0, 0, 0, 0.1);
    }
    
    .leaderboard-title {
      font-family: 'Press Start 2P', cursive;
      font-size: 0.9rem;
      margin: 0 0 5px 0;
      color: #333;
    }
    
    .date-range {
      font-size: 0.8rem;
      color: #666;
    }
    
    .leaderboard-content {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
    }
    
    .top-players {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    
    .player-row {
      display: flex;
      padding: 8px;
      border-radius: 5px;
      background-color: rgba(255, 255, 255, 0.5);
      border: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .player-row.header {
      background-color: rgba(0, 0, 0, 0.2);
      font-family: 'Press Start 2P', cursive;
      font-size: 0.7rem;
      padding: 10px 8px;
    }
    
    .player-row.current-user {
      background-color: rgba(255, 255, 0, 0.3);
      border: 1px solid rgba(255, 200, 0, 0.8);
    }
    
    .rank {
      width: 70px;
      text-align: center;
      font-weight: bold;
    }
    
    .name {
      flex: 1;
    }
    
    .points {
      width: 80px;
      text-align: right;
      font-weight: bold;
    }
    
    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;
      padding: 20px;
      color: #666;
      font-style: italic;
      
      p {
        margin: 5px 0;
      }
    }
    
    .leaderboard-actions {
      padding: 10px;
      display: flex;
      justify-content: center;
      border-top: 2px dotted #333;
    }
    
    .regenerate-button {
      background-color: rgba(255, 255, 255, 0.7);
      border: 2px solid #333;
      border-radius: 5px;
      padding: 6px 12px;
      font-family: 'Press Start 2P', cursive;
      font-size: 0.7rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.9);
        transform: translateY(-2px);
      }
      
      &:active {
        transform: translateY(0);
      }
      
      .icon {
        font-size: 1rem;
      }
    }
  `]
})
export class LeaderboardComponent implements OnInit {
  leaderboard: Leaderboard = {
    entries: [],
    weekStartDate: new Date(),
    weekEndDate: new Date()
  };
  
  constructor(private leaderboardService: LeaderboardService) {}
  
  ngOnInit(): void {
    this.leaderboardService.getLeaderboard().subscribe(leaderboard => {
      this.leaderboard = leaderboard;
    });
  }
  
  formatDate(date: Date): string {
    return `${date.getFullYear()}.${this.padZero(date.getMonth() + 1)}.${this.padZero(date.getDate())}`;
  }
  
  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
  
  isCurrentUser(entry: LeaderboardEntry): boolean {
    // Egyszerűsített verzió, később lehet bővíteni felhasználói azonosítással
    return entry.userId === 'user1';
  }
  
  regenerateLeaderboard(): void {
    this.leaderboardService.generateFakeLeaderboard();
  }
} 