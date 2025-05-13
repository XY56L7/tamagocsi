import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TamagocsiComponent } from './components/tamagocsi/tamagocsi.component';
import { CodingChallengeComponent } from './components/coding-challenge/coding-challenge.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TamagocsiComponent, CodingChallengeComponent, LeaderboardComponent],
  template: `
    <div class="tamagotchi-container">
      <div class="tamagotchi-device">
        <div class="tamagotchi-top">
          <div class="device-name">TAMAGOCSI-CODE</div>
        </div>
        
        <div class="tamagotchi-screen-container">
          <div class="screen-inner">
            <div class="screen-header">
              <h1 class="app-title">Tamagocsi Kódoló</h1>
              <div class="tab-buttons">
                <button class="tab-button" [class.active]="activeTab === 'game'" (click)="activeTab = 'game'">Játék</button>
                <button class="tab-button" [class.active]="activeTab === 'leaderboard'" (click)="activeTab = 'leaderboard'">Rangsor</button>
              </div>
            </div>
            
            <div class="screen-content" *ngIf="activeTab === 'game'">
              <div class="game-layout">
                <div class="pet-container">
                  <app-tamagocsi></app-tamagocsi>
                </div>
                <div class="challenge-container">
                  <app-coding-challenge></app-coding-challenge>
                </div>
              </div>
            </div>
            
            <div class="screen-content" *ngIf="activeTab === 'leaderboard'">
              <app-leaderboard></app-leaderboard>
            </div>
          </div>
        </div>
        
        <div class="tamagotchi-buttons">
          <button class="button-a">A</button>
          <button class="button-b">B</button>
          <button class="button-c">C</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      padding: 0;
    }
    
    .tamagotchi-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      max-height: 100vh;
      padding: 0.5rem;
      box-sizing: border-box;
    }
    
    .tamagotchi-device {
      background-color: var(--color-tamagotchi-case);
      border-radius: 20px;
      padding: 10px 10px 40px;
      box-shadow: var(--shadow-tamagotchi);
      max-width: 1000px;
      width: 90%;
      position: relative;
      border: 6px solid #ff41a6;
      max-height: 80vh;
      min-height: 580px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
    
    .tamagotchi-top {
      display: flex;
      justify-content: center;
      margin-bottom: 5px;
    }
    
    .device-name {
      background-color: white;
      padding: 3px 12px;
      border-radius: 15px;
      font-family: 'Press Start 2P', cursive;
      font-size: 0.7rem;
      color: var(--color-tamagotchi-case);
      border: 2px solid #333;
      transform: rotate(-2deg);
      box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
    }
    
    .tamagotchi-screen-container {
      background-color: #333;
      border-radius: 15px;
      padding: 10px;
      margin-bottom: 0;
      position: relative;
      overflow: hidden;
      box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
      flex: 1;
      min-height: 85%;
      max-height: 85%;
      display: flex;
      flex-direction: column;
    }
    
    .screen-inner {
      background-color: var(--color-tamagotchi-screen);
      border-radius: 8px;
      padding: 12px;
      height: auto;
      min-height: 500px;
      flex: 1;
      box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.2);
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
    
    .screen-header {
      text-align: center;
      border-bottom: 3px dotted #333;
      padding-bottom: 8px;
      margin-bottom: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .app-title {
      font-size: 1.2rem;
      margin: 0 0 8px 0;
      color: #333;
      text-shadow: 2px 2px 0 rgba(255, 255, 255, 0.5);
    }
    
    .tab-buttons {
      display: flex;
      gap: 10px;
    }
    
    .tab-button {
      background-color: rgba(0, 0, 0, 0.1);
      border: 2px solid #333;
      border-radius: 5px;
      padding: 4px 10px;
      font-family: 'Press Start 2P', cursive;
      font-size: 0.65rem;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        background-color: rgba(0, 0, 0, 0.2);
      }
      
      &.active {
        background-color: #333;
        color: var(--color-tamagotchi-screen);
      }
    }
    
    .screen-content {
      flex: 1;
      overflow: hidden;
      display: flex;
      margin-top: 10px;
      margin-bottom: 10px;
      min-height: 90%;
    }
    
    .game-layout {
      display: flex;
      width: 100%;
      gap: 12px;
    }
    
    .pet-container {
      width: 22%;
      min-width: 140px;
      max-width: 180px;
      display: flex;
      flex-direction: column;
    }
    
    .challenge-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 65%;
    }
    
    .screen-content app-tamagocsi,
    .screen-content app-coding-challenge,
    .screen-content app-leaderboard {
      flex: 1;
      display: block;
      height: 100%;
    }
    
    .tamagotchi-buttons {
      display: flex;
      justify-content: space-around;
      padding: 0 20%;
      position: absolute;
      bottom: 10px;
      left: 0;
      right: 0;
      z-index: 10;
      margin-top: 0;
    }
    
    .tamagotchi-buttons button {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--color-tamagotchi-btn);
      border: 3px solid #333;
      color: #333;
      font-family: 'Press Start 2P', cursive;
      font-size: 0.7rem;
      cursor: pointer;
      box-shadow: 0 4px 0 var(--color-tamagotchi-btn-shadow);
      transition: all 0.1s ease;
      
      &:hover {
        transform: translateY(-2px);
      }
      
      &:active {
        transform: translateY(4px);
        box-shadow: 0 0 0 var(--color-tamagotchi-btn-shadow);
      }
    }
    
    /* Pixel-art decorations */
    .screen-inner::before {
      content: '';
      position: absolute;
      top: 5px;
      right: 5px;
      width: 4px;
      height: 4px;
      background-color: #333;
      box-shadow: 
        4px 0 0 #333,
        8px 0 0 #333,
        0 4px 0 #333,
        4px 4px 0 #333,
        8px 4px 0 #333,
        0 8px 0 #333,
        4px 8px 0 #333,
        8px 8px 0 #333;
    }
    
    /* Responsive styles */
    @media (min-width: 1200px) {
      .tamagotchi-device {
        max-width: 1100px;
        max-height: 750px;
      }
      
      .app-title {
        font-size: 1.3rem;
      }
      
      .tab-button {
        font-size: 0.7rem;
        padding: 5px 12px;
      }
    }
    
    @media (min-width: 1600px) {
      .tamagotchi-device {
        max-width: 1200px;
        max-height: 800px;
      }
      
      .pet-container {
        max-width: 220px;
      }
    }
    
    @media (max-width: 992px) {
      .game-layout {
        flex-direction: column;
      }
      
      .pet-container {
        width: 100%;
        max-width: 100%;
        min-height: 160px;
        margin-bottom: 12px;
      }
    }
    
    @media (min-height: 800px) {
      .tamagotchi-device {
        min-height: 650px;
        padding: 10px 10px 45px;
      }
      
      .tamagotchi-screen-container {
        min-height: 90%;
        max-height: 90%;
      }
      
      .tamagotchi-buttons {
        bottom: 15px;
      }
    }
    
    @media (max-height: 700px) {
      .tamagotchi-device {
        max-height: 550px;
        min-height: 550px;
        padding: 10px 10px 35px;
      }
      
      .screen-inner {
        min-height: 450px;
      }
      
      .tamagotchi-buttons {
        bottom: 5px;
      }
      
      .tamagotchi-buttons button {
        width: 30px;
        height: 30px;
        font-size: 0.6rem;
      }
      
      .app-title {
        font-size: 0.9rem;
      }
      
      .device-name {
        font-size: 0.6rem;
        padding: 2px 10px;
      }
    }
  `]
})
export class AppComponent {
  title = 'tamagocsi';
  activeTab: 'game' | 'leaderboard' = 'game';
} 