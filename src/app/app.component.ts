import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TamagocsiComponent } from './components/tamagocsi/tamagocsi.component';
import { CodingChallengeComponent } from './components/coding-challenge/coding-challenge.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TamagocsiComponent, CodingChallengeComponent],
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
            </div>
            
            <div class="screen-content">
              <div class="row g-1">
                <div class="col-md-3">
                  <app-tamagocsi></app-tamagocsi>
                </div>
                <div class="col-md-9">
                  <app-coding-challenge></app-coding-challenge>
                </div>
              </div>
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
      max-width: 1200px;
      width: 100%;
      position: relative;
      border: 6px solid #ff41a6;
      max-height: calc(100vh - 40px);
      min-height: 700px;
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
      padding: 10px 10px 10px 10px;
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
      padding: 15px;
      height:600px;
      box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.2);
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    
    .screen-header {
      text-align: center;
      border-bottom: 3px dotted #333;
      padding-bottom: 10px;
      margin-bottom: 10px;
    }
    
    .app-title {
      font-size: 1.4rem;
      margin: 0;
      color: #333;
      text-shadow: 2px 2px 0 rgba(255, 255, 255, 0.5);
    }
    
    .screen-content {
      flex: 1;
      overflow: hidden;
      display: flex;
      margin-top: 15px;
      margin-bottom: 15px;
      min-height: 90%;
    }
    
    .screen-content .row {
      flex: 1;
      width: 100%;
      margin: 0 -5px;
    }
    
    .screen-content .col-md-3,
    .screen-content .col-md-9 {
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 0 8px;
    }
    
    .screen-content app-tamagocsi,
    .screen-content app-coding-challenge {
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
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: var(--color-tamagotchi-btn);
      border: 3px solid #333;
      color: #333;
      font-family: 'Press Start 2P', cursive;
      font-size: 0.8rem;
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
    
    @media (min-height: 800px) {
      .tamagotchi-device {
        max-height: 800px;
        min-height: 800px;
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
        max-height: 600px;
        min-height: 600px;
        padding: 10px 10px 35px;
      }
      
      .tamagotchi-buttons {
        bottom: 5px;
      }
      
      .tamagotchi-buttons button {
        width: 35px;
        height: 35px;
        font-size: 0.7rem;
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
} 