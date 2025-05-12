import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TamagocsiService } from '../../services/tamagocsi.service';
import { Tamagocsi } from '../../tamagocsi.model';

@Component({
  selector: 'app-tamagocsi',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card tamagocsi-card" [class.dead]="!tamagocsi.isAlive">
      <div class="card-body">
        <h2 class="card-title">{{ tamagocsi.name }}</h2>
        <div class="tamagocsi-status">
          <div class="status-bar">
            <label>Éhség:</label>
            <div class="progress">
              <div class="progress-bar bg-warning" 
                   [style.width.%]="tamagocsi.hunger"
                   role="progressbar">
                {{ tamagocsi.hunger }}%
              </div>
            </div>
          </div>
          <div class="status-bar">
            <label>Szomjúság:</label>
            <div class="progress">
              <div class="progress-bar bg-info" 
                   [style.width.%]="tamagocsi.thirst"
                   role="progressbar">
                {{ tamagocsi.thirst }}%
              </div>
            </div>
          </div>
          <div class="status-bar">
            <label>Energia:</label>
            <div class="progress">
              <div class="progress-bar bg-primary" 
                   [style.width.%]="tamagocsi.energy"
                   role="progressbar">
                {{ tamagocsi.energy }}%
              </div>
            </div>
          </div>
          <div class="status-bar">
            <label>Tapasztalat:</label>
            <div class="progress">
              <div class="progress-bar bg-success" 
                   [style.width.%]="(tamagocsi.experience / tamagocsi.experienceToNextLevel) * 100"
                   role="progressbar">
                {{ tamagocsi.experience }}/{{ tamagocsi.experienceToNextLevel }}
              </div>
            </div>
          </div>
        </div>
        <div class="tamagocsi-level">
          Szint: {{ tamagocsi.level }}
        </div>
        <div class="tamagocsi-actions" *ngIf="tamagocsi.isAlive">
          <button class="btn btn-warning" (click)="feed()">Etetés</button>
          <button class="btn btn-info" (click)="water()">Itatás</button>
          <button class="btn btn-primary" (click)="sleep()">Altatás</button>
        </div>
        <div class="tamagocsi-dead" *ngIf="!tamagocsi.isAlive">
          <p class="text-danger">A Tamagocsi meghalt! :(</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tamagocsi-card {
      max-width: 400px;
      margin: 20px auto 30px;
      background-color: #f8f9fa;
      border: 2px solid #dee2e6;
      border-radius: 15px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      min-height: 600px;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .card-body {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .tamagocsi-card.dead {
      background-color: #f8d7da;
      border-color: #f5c6cb;
    }

    .tamagocsi-status {
      margin: 20px 0;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
    }

    .status-bar {
      margin-bottom: 16px;
    }

    .status-bar label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }

    .progress {
      height: 20px;
      border-radius: 10px;
      background-color: #e9ecef;
    }

    .tamagocsi-level {
      text-align: center;
      font-size: 1.5em;
      font-weight: bold;
      margin: 25px 0;
    }

    .tamagocsi-actions {
      display: flex;
      justify-content: space-around;
      margin-top: 30px;
      margin-bottom: 25px;
    }

    .tamagocsi-dead {
      text-align: center;
      margin-top: 20px;
      font-size: 1.2em;
    }
  `]
})
export class TamagocsiComponent implements OnInit {
  tamagocsi: Tamagocsi;

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
} 