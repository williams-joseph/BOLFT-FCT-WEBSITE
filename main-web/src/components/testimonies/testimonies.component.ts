import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TestimonyService, Testimony } from '../../services/testimony.service';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

/**
 * TestimoniesComponent
 * 
 * Displays a public list of testimonies from church members.
 * Uses TestimonyService to stream data from Firestore.
 */
@Component({
  standalone: true,
  selector: 'app-testimonies',
  templateUrl: './testimonies.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class TestimoniesComponent {
  private readonly testimonyService = inject(TestimonyService);

  /** Reactive signal containing the list of testimonies */
  readonly testimonies = toSignal(this.testimonyService.getTestimonies(), { initialValue: [] });

  /** Pagination: Number of testimonies to display */
  readonly displayLimit = signal(9);

  /** Visible testimonies based on current limit */
  readonly visibleTestimonies = computed(() => {
    return this.testimonies().slice(0, this.displayLimit());
  });

  /** Whether there are more testimonies to load */
  readonly hasMore = computed(() => {
    return this.testimonies().length > this.displayLimit();
  });

  /** Currently selected testimony for the modal view */
  readonly selectedTestimony = signal<Testimony | null>(null);

  /**
   * Increases the display limit to show more records.
   */
  loadMore() {
    this.displayLimit.update(limit => limit + 9);
  }

  /**
   * Opens the full testimony content in a modal.
   */
  openModal(t: Testimony) {
    this.selectedTestimony.set(t);
  }

  /**
   * Closes the testimony modal.
   */
  closeModal() {
    this.selectedTestimony.set(null);
  }
}
