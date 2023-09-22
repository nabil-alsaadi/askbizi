import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WindowService } from './window.service';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  subjects: { [key: string]: BehaviorSubject<any> } = {};

  constructor(private windowService: WindowService) {
    window.addEventListener('storage', (event: StorageEvent) => {
      const key = event?.key;
      if (key && this.subjects[key]) {
        this.subjects[key].next(event.newValue);
      }
    });
  }

  getSubject<T>(key: string): BehaviorSubject<T> {
    if (!this.subjects[key]) {
      this.subjects[key] = new BehaviorSubject<T | null>(this.get<T>(key));
    }
    return this.subjects[key];
  }

  get<T>(key: string): T | null {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
    this.subjects[key].next(value);
  }

  remove(key: string): void {
    localStorage.removeItem(key);
    this.subjects[key].next(null);
  }

  clear(): void {
    localStorage.clear();
    Object.keys(this.subjects).forEach((key) => this.subjects[key].next(null));
  }

  get length(): number {
    return localStorage.length;
  }

  get keys(): string[] {
    return Object.keys(localStorage);
  }

  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
    this.subjects[key]?.next(value);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
    this.subjects[key]?.next(null);
  }

  key(index: number): string | null {
    return localStorage.key(index);
  }
}
