import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Leaderboard, LeaderboardEntry } from '../leaderboard.model';

interface FakeUser {
  username: string;
  avatar: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  private currentUser = {
    userId: 'user1',
    username: 'Játékos',
    avatar: '👨‍💻'
  };
  
  private leaderboard: Leaderboard = {
    entries: [],
    weekStartDate: this.getWeekStartDate(),
    weekEndDate: this.getWeekEndDate()
  };
  
  private leaderboardSubject = new BehaviorSubject<Leaderboard>(this.leaderboard);
  
  private fakeUsers: FakeUser[] = [
    { username: 'Kódfarkas', avatar: '🐺' },
    { username: 'ByteMester', avatar: '👨‍🔧' },
    { username: 'DevHuszár', avatar: '🐎' },
    { username: 'TechBajnok', avatar: '🏆' },
    { username: 'Programozó99', avatar: '💻' },
    { username: 'KódKirály', avatar: '👑' },
    { username: 'BitTündér', avatar: '🧚' },
    { username: 'PythonHős', avatar: '🐍' },
    { username: 'WebVarázs', avatar: '🧙‍♂️' },
    { username: 'JavaJedi', avatar: '⚔️' },
    { username: 'DataGuru', avatar: '📊' },
    { username: 'AlgoMágus', avatar: '🔮' },
    { username: 'FullStack123', avatar: '🥞' },
    { username: 'SzoftverSzakértő', avatar: '📱' },
    { username: 'HackerHernyó', avatar: '🐛' }
  ];
  
  constructor() {
    this.loadLeaderboard();
    // Ellenőrizzük minden nap, hogy kell-e resetelni a rangsort
    setInterval(() => this.checkAndResetLeaderboard(), 3600000); // Óránként ellenőrizzük
  }
  
  getLeaderboard(): Observable<Leaderboard> {
    return this.leaderboardSubject.asObservable();
  }
  
  addPoints(points: number): void {
    // Ellenőrizzük, hogy a jelenlegi hét-e
    this.checkAndResetLeaderboard();
    
    // Megkeressük a felhasználót a rangsorban
    const userIndex = this.leaderboard.entries.findIndex(
      entry => entry.userId === this.currentUser.userId
    );
    
    if (userIndex !== -1) {
      // Már létezik a felhasználó a rangsorban
      this.leaderboard.entries[userIndex].points += points;
      this.leaderboard.entries[userIndex].lastUpdated = new Date();
    } else {
      // Új felhasználó hozzáadása a rangsorhoz
      this.leaderboard.entries.push({
        userId: this.currentUser.userId,
        username: `${this.currentUser.avatar} ${this.currentUser.username}`,
        points: points,
        lastUpdated: new Date()
      });
    }
    
    // Rendezzük a rangsort
    this.sortLeaderboard();
    
    // Mentsük a rangsort
    this.saveLeaderboard();
    
    // Frissítsük a feliratkozókat
    this.leaderboardSubject.next({...this.leaderboard});
  }
  
  generateFakeLeaderboard(): void {
    // Töröljük a jelenlegi rangsort
    this.leaderboard.entries = [];
    
    // Keverjük össze a fake felhasználókat
    const shuffledUsers = [...this.fakeUsers].sort(() => Math.random() - 0.5);
    
    // Tegyük be a jelenlegi játékost is random pontszámmal
    const currentUserPoints = Math.floor(Math.random() * 1500) + 500;
    this.leaderboard.entries.push({
      userId: this.currentUser.userId,
      username: `${this.currentUser.avatar} ${this.currentUser.username}`,
      points: currentUserPoints,
      lastUpdated: new Date()
    });
    
    // Generáljunk különböző szintű játékosokat
    
    // Top játékosok (magas pontszám)
    for (let i = 0; i < 3; i++) {
      const user = shuffledUsers[i];
      const points = Math.floor(Math.random() * 500) + 1500;
      
      this.leaderboard.entries.push({
        userId: `fake-top-${i}`,
        username: `${user.avatar} ${user.username}`,
        points,
        lastUpdated: this.getRandomDateThisWeek()
      });
    }
    
    // Közepes játékosok
    for (let i = 3; i < 8; i++) {
      const user = shuffledUsers[i];
      const points = Math.floor(Math.random() * 500) + 800;
      
      this.leaderboard.entries.push({
        userId: `fake-mid-${i}`,
        username: `${user.avatar} ${user.username}`,
        points,
        lastUpdated: this.getRandomDateThisWeek()
      });
    }
    
    // Alacsony pontszámú játékosok
    for (let i = 8; i < 12; i++) {
      const user = shuffledUsers[i];
      const points = Math.floor(Math.random() * 500) + 100;
      
      this.leaderboard.entries.push({
        userId: `fake-low-${i}`,
        username: `${user.avatar} ${user.username}`,
        points,
        lastUpdated: this.getRandomDateThisWeek()
      });
    }
    
    // Rendezzük a rangsort
    this.sortLeaderboard();
    
    // Mentsük a rangsort
    this.saveLeaderboard();
    
    // Frissítsük a feliratkozókat
    this.leaderboardSubject.next({...this.leaderboard});
  }
  
  private getRandomDateThisWeek(): Date {
    const startDate = this.leaderboard.weekStartDate.getTime();
    const endDate = this.leaderboard.weekEndDate.getTime();
    const randomTimestamp = startDate + Math.random() * (endDate - startDate);
    return new Date(randomTimestamp);
  }
  
  private sortLeaderboard(): void {
    this.leaderboard.entries.sort((a, b) => b.points - a.points);
  }
  
  private getWeekStartDate(): Date {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = vasárnap, 1 = hétfő, ...
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    const monday = new Date(now);
    monday.setDate(now.getDate() - daysSinceMonday);
    monday.setHours(0, 0, 0, 0);
    
    return monday;
  }
  
  private getWeekEndDate(): Date {
    const startDate = this.getWeekStartDate();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);
    
    return endDate;
  }
  
  private checkAndResetLeaderboard(): void {
    const now = new Date();
    const currentWeekStart = this.getWeekStartDate();
    
    // Ellenőrizzük, hogy új hét kezdődött-e
    if (this.leaderboard.weekStartDate.getTime() < currentWeekStart.getTime()) {
      // Új hét kezdődött, reseteljük a rangsort
      this.leaderboard = {
        entries: [],
        weekStartDate: currentWeekStart,
        weekEndDate: this.getWeekEndDate()
      };
      
      this.saveLeaderboard();
      this.leaderboardSubject.next({...this.leaderboard});
    }
  }
  
  private saveLeaderboard(): void {
    try {
      localStorage.setItem('leaderboard', JSON.stringify(this.leaderboard));
    } catch (error) {
      console.error('Nem sikerült menteni a rangsort:', error);
    }
  }
  
  private loadLeaderboard(): void {
    try {
      const savedLeaderboard = localStorage.getItem('leaderboard');
      if (savedLeaderboard) {
        const parsed = JSON.parse(savedLeaderboard);
        
        // Konvertáljuk vissza a dátumokat
        parsed.weekStartDate = new Date(parsed.weekStartDate);
        parsed.weekEndDate = new Date(parsed.weekEndDate);
        parsed.entries.forEach((entry: LeaderboardEntry) => {
          entry.lastUpdated = new Date(entry.lastUpdated);
        });
        
        this.leaderboard = parsed;
        
        // Ellenőrizzük, hogy új hét kezdődött-e
        this.checkAndResetLeaderboard();
      } else {
        // Ha nincs mentett rangsor, generáljunk egyet
        this.generateFakeLeaderboard();
      }
    } catch (error) {
      console.error('Nem sikerült betölteni a rangsort:', error);
      // Hiba esetén is generáljunk fake adatokat
      this.generateFakeLeaderboard();
    }
  }
} 