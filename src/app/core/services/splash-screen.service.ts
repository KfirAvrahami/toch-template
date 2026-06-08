import { Injectable } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay } from '@angular/cdk/overlay';
import { BaseOverlayService } from '../../base/base-overlay.service';
import { SplashScreenComponent } from '../components/splash-screen/splash-screen.component';

@Injectable({ providedIn: 'root' })
export class SplashScreenService extends BaseOverlayService {
  constructor(overlay: Overlay) {
    super(overlay);
  }

  protected override getComponentPortal(): ComponentPortal<unknown> {
    return new ComponentPortal(SplashScreenComponent);
  }
}
