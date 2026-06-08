import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopBarComponent } from './core/components/top-bar/top-bar.component';
import { SideBarComponent } from './core/components/side-bar/side-bar.component';
import { AuthService } from './core/services/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopBarComponent, SideBarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly authService = inject(AuthService);
  protected readonly showTopBar = signal(true);
  protected readonly showSideBar = signal(true);
  protected readonly user = this.authService.getCurrentUser();
  protected readonly displayName = computed(() => this.user().displayName);
}
