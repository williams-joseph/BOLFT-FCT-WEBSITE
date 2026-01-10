import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SermonService, Sermon } from '../../services/sermon.service';
import { DatePipe, CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../services/modal.service';

/**
 * SermonsComponent
 * 
 * Displays a list of sermons fetched from the SermonService. 
 * Allows users to watch video messages on YouTube and download audio files from Google Drive.
 * 
 * NOTE: The in-browser audio player is currently disabled/commented out in the template 
 * to favor direct downloading from Google Drive.
 */
@Component({
  standalone: true,
  selector: 'app-sermons',
  templateUrl: './sermons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, CommonModule, FormsModule],
})
export class SermonsComponent {
  private readonly sermonService = inject(SermonService);
  private readonly http = inject(HttpClient);
  private readonly modalService = inject(ModalService);

  /** Reactive signal containing the list of all sermons */
  readonly sermons = toSignal(this.sermonService.getSermons(), { initialValue: [] });

  /** Reference to the hidden HTML5 audio element */
  readonly audioPlayer = viewChild<ElementRef<HTMLAudioElement>>('audioPlayer');

  /** ID of the sermon currently being played (if enabled) */
  readonly activeSermonId = signal<string | null>(null);

  /** Playback state */
  readonly isPlaying = signal(false);

  /** Current playback time in seconds */
  readonly currentTime = signal(0);

  /** Total duration of the audio in seconds */
  readonly duration = signal(0);

  /** Search criteria */
  readonly searchTerm = signal('');
  readonly searchDate = signal('');

  /** Tracks the ID of the sermon currently being downloaded to show a spinner/status */
  readonly downloadingId = signal<string | null>(null);

  /** Filtered list of sermons based on search criteria */
  readonly filteredSermons = computed(() => {
    const list = this.sermons();
    const term = this.searchTerm().toLowerCase().trim();
    const dateStr = this.searchDate();

    return list.filter(sermon => {
      const matchesTerm = !term ||
        sermon.title.toLowerCase().includes(term) ||
        sermon.preacher.toLowerCase().includes(term);

      const rawDate = sermon.date instanceof Date ? sermon.date : (sermon.date as any)?.toDate ? (sermon.date as any).toDate() : new Date(sermon.date as any);
      const sermonDate = rawDate ? rawDate.toISOString().split('T')[0] : '';
      const matchesDate = !dateStr || sermonDate === dateStr;

      return matchesTerm && matchesDate;
    }).slice(0, 50); // Limit to 50 for performance
  });

  /** Computed percentage for the progress bar (0-100) */
  readonly progress = computed(() => {
    const dur = this.duration();
    const curr = this.currentTime();
    return dur > 0 ? (curr / dur) * 100 : 0;
  });

  constructor() {
    /** Side effect to handle audio source changes and playback */
    effect(() => {
      const audioEl = this.audioPlayer()?.nativeElement;
      const activeId = this.activeSermonId();

      if (audioEl && activeId !== null) {
        const activeSermon = this.sermons().find(s => s.id === activeId);
        // Direct Google Drive download link used as audio source
        const audioSrc = activeSermon?.googleDriveId
          ? `https://docs.google.com/uc?export=download&id=${activeSermon.googleDriveId}`
          : undefined;

        if (audioSrc && audioEl.src !== audioSrc) {
          audioEl.src = audioSrc;
          audioEl.load();
          audioEl.play().catch(e => {
            console.error('Error playing audio:', e);
            this.modalService.showError('Unable to play audio. The link might be restricted or broken.', 'Playback Error');
            this.activeSermonId.set(null);
          });
        }
      } else if (audioEl && activeId === null) {
        audioEl.pause();
        audioEl.src = '';
      }
    });
  }

  /**
   * Toggles audio playback for a given sermon.
   * Currently unused in the template as the Listen button is commented out.
   */
  toggleAudio(sermon: Sermon): void {
    const audioEl = this.audioPlayer()?.nativeElement;
    if (!audioEl) return;

    if (this.activeSermonId() === sermon.id) {
      if (this.isPlaying()) {
        audioEl.pause();
      } else {
        audioEl.play().catch(e => console.error('Error playing audio:', e));
      }
    } else {
      this.activeSermonId.set(sermon.id!);
      this.currentTime.set(0);
      this.duration.set(0);
    }
  }

  /** Resets player state when audio ends */
  onAudioEnded(): void {
    this.activeSermonId.set(null);
    this.currentTime.set(0);
    this.duration.set(0);
  }

  /** Updates duration when metadata is loaded */
  onMetadataLoaded(event: Event): void {
    const audioEl = event.target as HTMLAudioElement;
    this.duration.set(audioEl.duration);
  }

  /** Updates current time during playback */
  onTimeUpdate(event: Event): void {
    const audioEl = event.target as HTMLAudioElement;
    this.currentTime.set(audioEl.currentTime);
  }

  /**
   * Downloads a sermon from Google Drive using HttpClient to handle as a blob.
   * This provides a better user experience by keeping them on the page.
   */
  async downloadSermon(sermon: Sermon) {
    if (!sermon.googleDriveId) return;

    this.downloadingId.set(sermon.id!);
    const url = `https://docs.google.com/uc?export=download&id=${sermon.googleDriveId}`;
    const fileName = `${sermon.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`;

    try {
      const blob = await this.http.get(url, { responseType: 'blob' }).toPromise();

      if (blob) {
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(downloadUrl);
      }
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to direct link if HttpClient is blocked by CORS
      try {
        window.open(url, '_blank');
      } catch (fallbackError) {
        this.modalService.showError('Failed to start download. Please check your internet connection or try a different browser.', 'Download Failed');
      }
    } finally {
      this.downloadingId.set(null);
    }
  }

  /**
   * Seeks to a specific point in the audio tracked by a progress bar click */
  seek(event: MouseEvent): void {
    const progressBar = event.currentTarget as HTMLElement;
    const audioEl = this.audioPlayer()?.nativeElement;
    if (!progressBar || !audioEl || !isFinite(this.duration()) || this.duration() <= 0) return;

    const { left, width } = progressBar.getBoundingClientRect();
    const clickX = event.clientX - left;
    const percentage = clickX / width;
    audioEl.currentTime = this.duration() * percentage;
  }

  /** Formats seconds into MM:SS string */
  formatTime(seconds: number): string {
    if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) {
      return '00:00';
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
