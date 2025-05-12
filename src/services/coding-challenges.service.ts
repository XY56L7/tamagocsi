import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { filter, catchError } from 'rxjs/operators';
import { CodingChallenge } from '../coding-challenge.model';

@Injectable({
  providedIn: 'root'
})
export class CodingChallengesService {
  private challenges: CodingChallenge[] = [];
  private currentChallengeSubject = new BehaviorSubject<CodingChallenge | null>(null);

  constructor(private http: HttpClient) {
    this.loadChallenges();
  }

  private loadChallenges(): void {
    console.log('Kódolási feladatok betöltése...');
    this.http.get<{challenges: CodingChallenge[]}>('assets/coding-challenges.json')
      .pipe(
        catchError(error => {
          console.warn('Nem sikerült betölteni az assets/coding-challenges.json fájlt, próbálkozás a src mappából', error);
          return this.http.get<{challenges: CodingChallenge[]}>('../coding-challenges.json');
        })
      )
      .subscribe(
        data => {
          console.log('Sikeresen betöltve a kódolási feladatok', data);
          this.challenges = data.challenges;
          if (this.challenges.length > 0) {
            const randomIndex = Math.floor(Math.random() * this.challenges.length);
            this.currentChallengeSubject.next(this.challenges[randomIndex]);
          }
        },
        error => {
          console.error('Nem sikerült betölteni a kódolási feladatokat:', error);
          // Fallback: hardcoded challenges
          this.challenges = [
            {
              id: 1,
              title: "Összeadás",
              description: "Írj egy függvényt, ami összead két számot!",
              difficulty: "easy",
              language: "python",
              code: "def add_numbers(a, b):\n    # Írd ide a megoldást\n    pass",
              testCases: [
                  {
                      input: "add_numbers(2, 3)",
                      expectedOutput: "5"
                  },
                  {
                      input: "add_numbers(-1, 1)",
                      expectedOutput: "0"
                  }
              ],
              experienceReward: 10,
              solution: "def add_numbers(a, b):\n    return a + b"
            }
          ];
          const randomIndex = Math.floor(Math.random() * this.challenges.length);
          this.currentChallengeSubject.next(this.challenges[randomIndex]);
        }
      );
  }

  getRandomChallenge(): Observable<CodingChallenge> {
    if (this.challenges.length === 0) {
      // Ha még nincsenek kihívások betöltve, várjuk meg a betöltést
      return this.currentChallengeSubject.asObservable().pipe(
        filter((challenge): challenge is CodingChallenge => challenge !== null)
      );
    }
    
    const randomIndex = Math.floor(Math.random() * this.challenges.length);
    const challenge = this.challenges[randomIndex];
    this.currentChallengeSubject.next(challenge);
    return of(challenge);
  }

  validateSolution(challenge: CodingChallenge, userSolution: string): boolean {
    try {
      // Itt később implementálhatunk egy Python kód futtató és validáló rendszert
      // Egyelőre csak egyszerű string összehasonlítást végzünk
      return userSolution.trim() === challenge.solution.trim();
    } catch (error) {
      console.error('Hiba a megoldás validálása során:', error);
      return false;
    }
  }
} 