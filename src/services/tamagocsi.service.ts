import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Tamagocsi } from '../tamagocsi.model';

@Injectable({
  providedIn: 'root'
})
export class TamagocsiService {
  private tamagocsi: Tamagocsi = {
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

  private tamagocsiSubject = new BehaviorSubject<Tamagocsi>(this.tamagocsi);

  constructor() {
    // Indítsuk el a Tamagocsi állapotának időbeli változását
    setInterval(() => this.updateStatus(), 60000); // Minden percben frissítjük
  }

  getTamagocsi(): Observable<Tamagocsi> {
    return this.tamagocsiSubject.asObservable();
  }

  feed(): void {
    if (this.tamagocsi.isAlive) {
      this.tamagocsi.hunger = Math.min(100, this.tamagocsi.hunger + 30);
      this.tamagocsi.lastFed = new Date();
      this.updateTamagocsi();
    }
  }

  water(): void {
    if (this.tamagocsi.isAlive) {
      this.tamagocsi.thirst = Math.min(100, this.tamagocsi.thirst + 30);
      this.tamagocsi.lastWatered = new Date();
      this.updateTamagocsi();
    }
  }

  sleep(): void {
    if (this.tamagocsi.isAlive) {
      this.tamagocsi.energy = Math.min(100, this.tamagocsi.energy + 40);
      this.tamagocsi.lastSlept = new Date();
      this.updateTamagocsi();
    }
  }

  addExperience(amount: number): void {
    if (this.tamagocsi.isAlive) {
      this.tamagocsi.experience += amount;
      
      // Szintlépés ellenőrzése
      while (this.tamagocsi.experience >= this.tamagocsi.experienceToNextLevel) {
        this.tamagocsi.level++;
        this.tamagocsi.experience -= this.tamagocsi.experienceToNextLevel;
        this.tamagocsi.experienceToNextLevel = Math.floor(this.tamagocsi.experienceToNextLevel * 1.5);
      }
      
      this.updateTamagocsi();
    }
  }

  private updateStatus(): void {
    if (this.tamagocsi.isAlive) {
      // Éhség, szomjúság és energia csökkentése idővel
      const now = new Date();
      const hoursSinceLastFed = (now.getTime() - this.tamagocsi.lastFed.getTime()) / (1000 * 60 * 60);
      const hoursSinceLastWatered = (now.getTime() - this.tamagocsi.lastWatered.getTime()) / (1000 * 60 * 60);
      const hoursSinceLastSlept = (now.getTime() - this.tamagocsi.lastSlept.getTime()) / (1000 * 60 * 60);

      this.tamagocsi.hunger = Math.max(0, this.tamagocsi.hunger - hoursSinceLastFed * 5);
      this.tamagocsi.thirst = Math.max(0, this.tamagocsi.thirst - hoursSinceLastWatered * 5);
      this.tamagocsi.energy = Math.max(0, this.tamagocsi.energy - hoursSinceLastSlept * 4);

      // Ha túl éhes, szomjas vagy fáradt, meghal
      if (this.tamagocsi.hunger <= 0 || this.tamagocsi.thirst <= 0 || this.tamagocsi.energy <= 0) {
        this.tamagocsi.isAlive = false;
      }

      this.updateTamagocsi();
    }
  }

  private updateTamagocsi(): void {
    this.tamagocsiSubject.next({...this.tamagocsi});
  }
}