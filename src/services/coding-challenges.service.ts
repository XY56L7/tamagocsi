import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { filter, catchError, switchMap, tap } from 'rxjs/operators';
import { CodingChallenge, CodingLanguage } from '../coding-challenge.model';
import { LeaderboardService } from './leaderboard.service';
import { LanguagePreferenceService } from './language-preference.service';

@Injectable({
  providedIn: 'root'
})
export class CodingChallengesService {
  private challenges: CodingChallenge[] = [];
  private currentChallengeSubject = new BehaviorSubject<CodingChallenge | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();
  currentChallenge$ = this.currentChallengeSubject.asObservable();

  constructor(
    private http: HttpClient,
    private leaderboardService: LeaderboardService,
    private languagePreference: LanguagePreferenceService
  ) {
    this.loadChallenges();
    
    // Figyelni a nyelvi preferencia változását és újratölteni a feladatokat
    this.languagePreference.selectedLanguage$.pipe(
      tap(() => this.loadingSubject.next(true))
    ).subscribe(() => {
      this.getRandomChallengeByLanguage();
      this.loadingSubject.next(false);
    });
  }

  private loadChallenges(): void {
    console.log('Kódolási feladatok betöltése...');
    this.loadingSubject.next(true);
    
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
            this.getRandomChallengeByLanguage();
          }
          this.loadingSubject.next(false);
        },
        error => {
          console.error('Nem sikerült betölteni a kódolási feladatokat:', error);
          // Fallback: hardcoded challenges
          this.challenges = [
            {
              id: 1,
              title: "Összeadás (Python)",
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
            },
            {
              id: 2,
              title: "Összeadás (JavaScript)",
              description: "Írj egy függvényt, ami összead két számot!",
              difficulty: "easy",
              language: "javascript",
              code: "function addNumbers(a, b) {\n    // Írd ide a megoldást\n}",
              testCases: [
                  {
                      input: "addNumbers(2, 3)",
                      expectedOutput: "5"
                  },
                  {
                      input: "addNumbers(-1, 1)",
                      expectedOutput: "0"
                  }
              ],
              experienceReward: 10,
              solution: "function addNumbers(a, b) {\n    return a + b;\n}"
            },
            {
              id: 3,
              title: "Összeadás (Java)",
              description: "Írj egy metódust, ami összead két számot!",
              difficulty: "easy",
              language: "java",
              code: "public class Calculator {\n    public static int addNumbers(int a, int b) {\n        // Írd ide a megoldást\n        return 0;\n    }\n}",
              testCases: [
                  {
                      input: "addNumbers(2, 3)",
                      expectedOutput: "5"
                  },
                  {
                      input: "addNumbers(-1, 1)",
                      expectedOutput: "0"
                  }
              ],
              experienceReward: 10,
              solution: "public class Calculator {\n    public static int addNumbers(int a, int b) {\n        return a + b;\n    }\n}"
            }
          ];
          this.getRandomChallengeByLanguage();
          this.loadingSubject.next(false);
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
    
    this.getRandomChallengeByLanguage();
    return this.currentChallengeSubject.asObservable().pipe(
      filter((challenge): challenge is CodingChallenge => challenge !== null)
    );
  }
  
  private getRandomChallengeByLanguage(): void {
    const selectedLanguage = this.languagePreference.currentLanguage;
    const filteredChallenges = this.challenges.filter(
      challenge => challenge.language === selectedLanguage
    );
    
    if (filteredChallenges.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredChallenges.length);
      this.currentChallengeSubject.next(filteredChallenges[randomIndex]);
    } else {
      // Ha nincsenek feladatok az adott nyelven, nullt küldünk
      this.currentChallengeSubject.next(null);
    }
  }

  validateSolution(challenge: CodingChallenge, userSolution: string): boolean {
    try {
      // Itt később implementálhatunk egy Python kód futtató és validáló rendszert
      // Egyelőre csak egyszerű string összehasonlítást végzünk
      const isCorrect = userSolution.trim() === challenge.solution.trim();
      
      // Ha helyes a megoldás, adjunk pontokat a játékosnak
      if (isCorrect) {
        this.leaderboardService.addPoints(challenge.experienceReward);
      }
      
      return isCorrect;
    } catch (error) {
      console.error('Hiba a megoldás validálása során:', error);
      return false;
    }
  }
  
  getAvailableLanguages(): CodingLanguage[] {
    // A kihívásokban szereplő nyelvek egyedi listája
    const uniqueLanguages: Set<CodingLanguage> = new Set();
    
    this.challenges.forEach(challenge => {
      uniqueLanguages.add(challenge.language);
    });
    
    return Array.from(uniqueLanguages);
  }
} 