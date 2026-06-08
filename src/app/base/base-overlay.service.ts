import { Injectable } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { firstValueFrom, timer } from 'rxjs';

@Injectable()
export abstract class BaseOverlayService {
  private counter = 0;
  private overlayRef: OverlayRef | null = null;

  constructor(private readonly overlay: Overlay) {}

  protected abstract getComponentPortal(): ComponentPortal<unknown>;

  private getOrCreateOverlayRef(): OverlayRef {
    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create({
        panelClass: ['overlay-wrapper'],
        hasBackdrop: true,
        backdropClass: 'cdk-overlay-dark-backdrop',
        positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically()
      });
    }
    return this.overlayRef;
  }

  moveTop(): void {
    const overlayRef = this.getOrCreateOverlayRef();
    overlayRef.addPanelClass('top-panel');
  }

  show(): void {
    const overlayRef = this.getOrCreateOverlayRef();
    if (this.counter <= 0 && !overlayRef.hasAttached()) {
      overlayRef.attach(this.getComponentPortal());
    }
    this.counter++;
  }

  hide(): void {
    if (this.counter > 0) {
      this.counter--;
    }
    if (this.counter <= 0 && this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  removeAll(): void {
    this.counter = 0;
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  async hideWithFade(durationMs = 350): Promise<void> {
    if (this.counter > 0) {
      this.counter--;
    }
    if (this.counter === 0 && this.overlayRef) {
      this.overlayRef.addPanelClass('overlay-fade-out');
      await firstValueFrom(timer(durationMs));
      this.overlayRef.removePanelClass('overlay-fade-out');
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
}
