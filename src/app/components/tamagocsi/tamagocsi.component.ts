import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TamagocsiService } from '../../../services/tamagocsi.service';
import { Tamagocsi } from '../../../tamagocsi.model';

@Component({
  selector: 'app-tamagocsi',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tamagotchi-pet-container" [class.dead]="!tamagocsi.isAlive">
      <div class="pet-stats">
        <div class="pet-header">
          <div class="pet-name">{{ tamagocsi.name }}</div>
          <div class="pet-level">{{ tamagocsi.level }}</div>
        </div>
        
        <div class="pet-screen">
          <div class="pet-character" [class.bounce]="recentlyLeveledUp" [class.dead]="!tamagocsi.isAlive">
            <div class="pet-pixel-art">
              <div class="pet-eyes" [class.blink]="tamagocsi.energy < 30">
                <div class="eye left"></div>
                <div class="eye right"></div>
              </div>
              <div class="pet-mouth" [class.sad]="tamagocsi.hunger < 30 || tamagocsi.thirst < 30"></div>
            </div>
          </div>
          
          <div class="pet-status">
            <div class="status-item">
              <span class="status-icon">🍗</span>
              <div class="status-bar">
                <div class="status-fill" [style.width.%]="tamagocsi.hunger"></div>
              </div>
            </div>
            
            <div class="status-item">
              <span class="status-icon">💧</span>
              <div class="status-bar">
                <div class="status-fill" [style.width.%]="tamagocsi.thirst"></div>
              </div>
            </div>
            
            <div class="status-item">
              <span class="status-icon">😴</span>
              <div class="status-bar">
                <div class="status-fill" [style.width.%]="tamagocsi.energy"></div>
              </div>
            </div>
            
            <div class="status-item">
              <span class="status-icon">⭐</span>
              <div class="status-bar">
                <div class="status-fill" [style.width.%]="(tamagocsi.experience / tamagocsi.experienceToNextLevel) * 100"></div>
                <span class="xp-text">{{ tamagocsi.experience }}/{{ tamagocsi.experienceToNextLevel }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="pet-controls">
          <div class="control-buttons" *ngIf="tamagocsi.isAlive">
            <button class="pixel-button" (click)="feed()">🍗</button>
            <button class="pixel-button" (click)="water()">💧</button>
            <button class="pixel-button" (click)="sleep()">😴</button>
          </div>
          
          <div class="control-buttons" *ngIf="!tamagocsi.isAlive">
            <button class="reset-button" (click)="resetTamagocsi()">
              <span class="blink">⟳</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tamagotchi-pet-container {
      height: 100%;
      border-radius: 6px;
      overflow: hidden;
      background-color: var(--color-tamagotchi-screen-bg);
      border: 2px solid #333;
      padding: 2px;
      box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
    }
    
    .tamagotchi-pet-container.dead {
      background-color: #6e1423;
    }
    
    .pet-stats {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .pet-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
      border-bottom: 2px dotted #333;
      padding: 4px 8px;
    }
    
    .pet-name {
      font-family: 'Press Start 2P', cursive;
      font-size: 0.75rem;
      color: #333;
    }
    
    .pet-level {
      font-family: 'Press Start 2P', cursive;
      font-size: 0.75rem;
      color: #333;
      background-color: rgba(255, 255, 255, 0.5);
      padding: 2px 5px;
      border-radius: 3px;
    }
    
    .pet-screen {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 6px;
      background-color: rgba(255, 255, 255, 0.3);
      border-radius: 4px;
      margin: 0 5px 6px;
      border: 2px solid #333;
    }
    
    .pet-character {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 90px;
    }
    
    .pet-pixel-art {
      width: 80px;
      height: 80px;
      position: relative;
      background-color: transparent;
    }
    
    .pet-eyes {
      position: absolute;
      top: 30px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
    }
    
    .eye {
      width: 12px;
      height: 12px;
      background-color: #333;
      border-radius: 50%;
      position: relative;
    }
    
    .eye::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 4px;
      height: 4px;
      background-color: white;
      border-radius: 50%;
    }
    
    .pet-mouth {
      position: absolute;
      top: 50px;
      left: 50%;
      transform: translateX(-50%);
      width: 30px;
      height: 8px;
      border-bottom: 3px solid #333;
      border-radius: 0 0 20px 20px;
    }
    
    .pet-mouth.sad {
      top: 55px;
      border-bottom: 0;
      border-top: 3px solid #333;
      border-radius: 20px 20px 0 0;
    }
    
    .pet-status {
      margin-top: 10px;
    }
    
    .status-item {
      display: flex;
      align-items: center;
      margin-bottom: 6px;
    }
    
    .status-icon {
      font-size: 0.95rem;
      margin-right: 6px;
      width: 18px;
      text-align: center;
    }
    
    .status-bar {
      flex: 1;
      height: 10px;
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 5px;
      overflow: hidden;
      position: relative;
      border: 1px solid #333;
    }
    
    .status-fill {
      height: 100%;
      background-color: rgba(255, 255, 255, 0.7);
      border-radius: 4px;
      transition: width 0.3s ease;
    }
    
    .xp-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 0.7rem;
      color: #333;
      text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5);
    }
    
    .pet-controls {
      padding: 6px;
      border-top: 2px dotted #333;
      display: flex;
      justify-content: center;
    }
    
    .control-buttons {
      display: flex;
      gap: 8px;
    }
    
    .pixel-button {
      width: 30px;
      height: 30px;
      border-radius: 4px;
      background-color: var(--color-tamagotchi-btn);
      border: 2px solid #333;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 0 #d9a400;
      transition: all 0.1s ease;
      
      &:hover {
        transform: translateY(-2px);
      }
      
      &:active {
        transform: translateY(2px);
        box-shadow: 0 0 0 #d9a400;
      }
    }
    
    .reset-button {
      padding: 4px 10px;
      border-radius: 4px;
      background-color: #ff4757;
      border: 2px solid #333;
      color: white;
      font-family: 'Press Start 2P', cursive;
      font-size: 0.7rem;
      cursor: pointer;
      box-shadow: 0 2px 0 #e2303d;
      
      &:hover {
        transform: translateY(-2px);
      }
      
      &:active {
        transform: translateY(2px);
        box-shadow: 0 0 0 #e2303d;
      }
    }
    
    .pet-character.bounce {
      animation: bounce 0.8s infinite;
    }
    
    .pet-character.dead {
      opacity: 0.5;
    }
    
    .pet-eyes.blink {
      animation: blink 0.5s infinite;
    }
    
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    
    @media (max-height: 700px) {
      .pet-character {
        height: 70px;
      }
      
      .pet-pixel-art {
        width: 60px;
        height: 60px;
      }
      
      .pet-eyes {
        top: 20px;
        padding: 0 15px;
      }
      
      .eye {
        width: 10px;
        height: 10px;
      }
      
      .pet-mouth {
        top: 40px;
        width: 25px;
      }
      
      .pet-mouth.sad {
        top: 45px;
      }
      
      .pixel-button {
        width: 25px;
        height: 25px;
        font-size: 0.8rem;
      }
    }
  `]
})
export class TamagocsiComponent implements OnInit {
  tamagocsi: Tamagocsi;
  recentlyLeveledUp: boolean = false;
  private previousLevel: number = 1;

  constructor(private tamagocsiService: TamagocsiService) {
    this.tamagocsi = {
      id: 1,
      name: 'CodePet',
      level: 1,
      hunger: 100,
      thirst: 100,
      energy: 100,
      experience: 0,
      experienceToNextLevel: 100,
      lastFed: new Date(),
      lastWatered: new Date(),
      lastSlept: new Date(),
      isAlive: true
    };
  }

  ngOnInit(): void {
    this.tamagocsiService.getTamagocsi().subscribe(tamagocsi => {
      // Ha szintlépés történt
      if (tamagocsi.level > this.previousLevel) {
        this.levelUp();
      }
      this.previousLevel = tamagocsi.level;
      this.tamagocsi = tamagocsi;
    });
  }

  feed(): void {
    this.tamagocsiService.feed();
  }

  water(): void {
    this.tamagocsiService.water();
  }

  sleep(): void {
    this.tamagocsiService.sleep();
  }

  resetTamagocsi(): void {
    location.reload();
  }

  private levelUp(): void {
    this.recentlyLeveledUp = true;
    setTimeout(() => {
      this.recentlyLeveledUp = false;
    }, 3000);
  }
}