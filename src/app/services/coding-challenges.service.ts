import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CodingChallenge } from '../models/coding-challenge.model';

@Injectable({
  providedIn: 'root'
})
export class CodingChallengesService {
  private challenges: CodingChallenge[] = [
    {
      id: 1,
      title: 'Összeg számítása',
      description: 'Írj egy függvényt, ami kiszámítja egy lista elemeinek összegét!',
      difficulty: 'easy',
      language: 'python',
      code: 'def sum_list(numbers):\n    # Ide írd a megoldást\n    pass',
      testCases: [
        { input: '[1, 2, 3, 4, 5]', expectedOutput: '15' },
        { input: '[-1, 0, 1]', expectedOutput: '0' },
        { input: '[]', expectedOutput: '0' }
      ],
      experienceReward: 10,
      solution: 'def sum_list(numbers):\n    return sum(numbers)'
    },
    {
      id: 2,
      title: 'Fibonacci sorozat',
      description: 'Írj egy függvényt, ami visszaadja az n-edik Fibonacci számot!',
      difficulty: 'medium',
      language: 'python',
      code: 'def fibonacci(n):\n    # Ide írd a megoldást\n    pass',
      testCases: [
        { input: '0', expectedOutput: '0' },
        { input: '1', expectedOutput: '1' },
        { input: '5', expectedOutput: '5' },
        { input: '10', expectedOutput: '55' }
      ],
      experienceReward: 20,
      solution: 'def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)'
    },
    {
      id: 3,
      title: 'Palindrom ellenőrzés',
      description: 'Írj egy függvényt, ami ellenőrzi, hogy egy szöveg palindrom-e!',
      difficulty: 'easy',
      language: 'python',
      code: 'def is_palindrome(text):\n    # Ide írd a megoldást\n    pass',
      testCases: [
        { input: '"radar"', expectedOutput: 'True' },
        { input: '"hello"', expectedOutput: 'False' },
        { input: '"A man, a plan, a canal: Panama"', expectedOutput: 'True' }
      ],
      experienceReward: 15,
      solution: 'def is_palindrome(text):\n    text = "".join(c.lower() for c in text if c.isalnum())\n    return text == text[::-1]'
    }
  ];

  constructor() {}

  getChallenges(): Observable<CodingChallenge[]> {
    return of(this.challenges);
  }

  getChallengeById(id: number): Observable<CodingChallenge | undefined> {
    return of(this.challenges.find(challenge => challenge.id === id));
  }

  getRandomChallenge(): Observable<CodingChallenge> {
    const randomIndex = Math.floor(Math.random() * this.challenges.length);
    return of(this.challenges[randomIndex]);
  }

  validateSolution(challenge: CodingChallenge, solution: string): boolean {
    try {
      // Egyszerű validáció: ellenőrizzük, hogy a megoldás tartalmazza a megoldás kulcsszavait
      const solutionKeywords = challenge.solution.split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'))
        .join(' ')
        .toLowerCase();

      const userSolutionKeywords = solution.split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'))
        .join(' ')
        .toLowerCase();

      return userSolutionKeywords.includes(solutionKeywords);
    } catch (error) {
      console.error('Hiba a megoldás validálásakor:', error);
      return false;
    }
  }
} 