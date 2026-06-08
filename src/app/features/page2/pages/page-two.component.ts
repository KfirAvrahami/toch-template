import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { interval, takeUntil } from 'rxjs';
import { formatSapMessage, parseDateForSAP, parseSAPDate } from '@toch/sap-utils';
import { BaseComponent } from '../../../base/base.component';
import { LoadingService } from '../../../core/services/loading.service';
import { SplashScreenService } from '../../../core/services/splash-screen.service';
import { Page2AdapterResult } from '../types';
import { Page2Service } from '../services/page2.service';

@Component({
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
  templateUrl: './page-two.component.html',
  styleUrl: './page-two.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageTwoComponent extends BaseComponent {
  private readonly loadingService = inject(LoadingService);
  private readonly splashScreenService = inject(SplashScreenService);
  private readonly page2Service = inject(Page2Service);

  protected readonly initStatus = signal('waiting');
  protected readonly viewInitStatus = signal('waiting');
  protected readonly adapterResult = signal<Page2AdapterResult | undefined>(undefined);
  protected readonly adapterError = signal('');
  protected readonly cacheTestStatus = signal('');
  protected readonly sapReadableData = signal<unknown | undefined>(undefined);
  protected readonly tick$ = interval(1000).pipe(takeUntil(this.destroyed$));
  protected readonly lifecycleSummary = computed(
    () =>
      $localize`:@@page2.lifecycleSummary:init: ${this.initStatus()}:initStatus: | viewInit: ${this.viewInitStatus()}:viewInitStatus:`
  );

  private loadingTimer: ReturnType<typeof setTimeout> | undefined;
  private splashTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    super();

    this.init$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.initStatus.set('triggered');
    });

    this.viewInit$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.viewInitStatus.set('triggered');
    });
  }

  protected showLoading(): void {
    this.loadingService.show();
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer);
    }
    this.loadingTimer = setTimeout(() => {
      this.loadingService.hide();
      this.loadingTimer = undefined;
    }, 5000);
  }

  protected showSplash(): void {
    this.splashScreenService.show();
    if (this.splashTimer) {
      clearTimeout(this.splashTimer);
    }
    this.splashTimer = setTimeout(async () => {
      await this.splashScreenService.hideWithFade();
      this.splashTimer = undefined;
    }, 5000);
  }

  protected runActiveAdapter(): void {
    this.adapterError.set('');
    this.cacheTestStatus.set('');
    this.page2Service
      .getData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (result) => this.adapterResult.set(result),
        error: (error: unknown) => {
          this.adapterError.set(
            error instanceof Error
              ? error.message
              : $localize`:@@page2.adapterError:Adapter API failed`
          );
        }
      });
  }

  protected runCacheTest(): void {
    this.adapterError.set('');
    this.cacheTestStatus.set($localize`:@@page2.cacheTestRunning:Running two identical GET calls...`);
    this.page2Service
      .getData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: () => {
          this.page2Service
            .getData()
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
              next: (result) => {
                this.adapterResult.set(result);
                this.cacheTestStatus.set(
                  $localize`:@@page2.cacheTestComplete:Second call completed. With cache interceptor, repeated identical GET should be served from cache.`
                );
              },
              error: (error: unknown) => {
                this.adapterError.set(
                  error instanceof Error
                    ? error.message
                    : $localize`:@@page2.adapterError:Adapter API failed`
                );
              }
            });
        },
        error: (error: unknown) => {
          this.adapterError.set(
            error instanceof Error
              ? error.message
              : $localize`:@@page2.adapterError:Adapter API failed`
          );
        }
      });
  }

  protected formatSapLikeData(): void {
    const sapDateString = parseDateForSAP(new Date('2026-03-26T10:30:00.000Z'));
    const readableDate = parseSAPDate(sapDateString);

    const sapMessage = {
      code: 'SAMPLE_001',
      message: 'Document saved successfully',
      severity: 'success' as const,
      details: [],
      target: '',
      transition: false
    };

    const readableMessage = formatSapMessage(sapMessage);

    this.sapReadableData.set({
      sapDateString,
      readableDate: readableDate?.toISOString() ?? undefined,
      readableMessage
    });
  }
}
