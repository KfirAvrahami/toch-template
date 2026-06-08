import { inject, Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

const ICON_ASSETS: ReadonlyArray<{ name: string; path: string }> = [
  { name: 'home', path: 'assets/icons/home.svg' },
  { name: 'menu', path: 'assets/icons/menu.svg' },
  { name: 'page', path: 'assets/icons/page.svg' }
];

/**
 * Registers SVG icons with MatIconRegistry once at application bootstrap.
 */
@Injectable({ providedIn: 'root' })
export class IconRegistryService {
  private readonly iconRegistry = inject(MatIconRegistry);
  private readonly sanitizer = inject(DomSanitizer);

  /**
   * Registers all template SVG icons for use with mat-icon svgIcon.
   */
  registerIcons(): void {
    for (const icon of ICON_ASSETS) {
      this.iconRegistry.addSvgIcon(
        icon.name,
        this.sanitizer.bypassSecurityTrustResourceUrl(icon.path)
      );
    }
  }
}
