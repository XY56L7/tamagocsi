import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CodingLanguage } from '../coding-challenge.model';

@Injectable({
  providedIn: 'root'
})
export class LanguagePreferenceService {
  private readonly STORAGE_KEY = 'selectedLanguage';
  private selectedLanguageSubject = new BehaviorSubject<CodingLanguage>('python');
  
  constructor() {
    this.loadSavedLanguage();
  }
  
  get selectedLanguage$(): Observable<CodingLanguage> {
    return this.selectedLanguageSubject.asObservable();
  }
  
  get currentLanguage(): CodingLanguage {
    return this.selectedLanguageSubject.value;
  }
  
  setLanguage(language: CodingLanguage): void {
    this.selectedLanguageSubject.next(language);
    this.saveLanguage(language);
  }
  
  private loadSavedLanguage(): void {
    try {
      const savedLanguage = localStorage.getItem(this.STORAGE_KEY);
      if (savedLanguage) {
        const language = savedLanguage as CodingLanguage;
        this.selectedLanguageSubject.next(language);
      }
    } catch (error) {
      console.error('Nem sikerült betölteni a mentett nyelvi preferenciát', error);
    }
  }
  
  private saveLanguage(language: CodingLanguage): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, language);
    } catch (error) {
      console.error('Nem sikerült menteni a nyelvi preferenciát', error);
    }
  }
} 