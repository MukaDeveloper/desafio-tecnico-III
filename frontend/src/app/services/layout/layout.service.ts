import { effect, Injectable, signal, WritableSignal } from '@angular/core';
import { ERoutes } from '../../shared/utils/routes.enum';
import { BehaviorSubject } from 'rxjs';
import { routes } from '../../app.routes';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly storageKey = 'darkMode';
  private readonly className = 'dark';

  private expanded$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  private darkMode$: WritableSignal<boolean> = signal(false /* this.getStoredPreference() */);

  constructor() {
    effect(() => {
      const isDark = this.darkMode$();
      document.documentElement.classList.toggle(this.className, isDark);
      localStorage.setItem(this.storageKey, JSON.stringify(isDark));
    });
  }

  public get expanded(): boolean {
    return this.expanded$.getValue();
  }

  public get isDarkMode(): boolean {
    return this.darkMode$();
  }

  public toggleMode(value?: boolean): void {
    this.darkMode$.update((v) => value ?? !v);
  }

  public toggleExpanded(value?: boolean): void {
    this.expanded$.next(value ?? !this.expanded);
  }
}

export const layoutItems = [
  {
    label: 'Principal',
    admin: false,
    children: [
      {
        label: 'Pacientes',
        icon: 'group',
        route: ERoutes.PATIENTS,
      },
    ],
  },
];
