import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

/**
 * HomeComponent
 * 
 * The landing page for the church website. 
 * Features a dynamic Bible verse carousel that rotates through selected scriptures.
 */
@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [RouterLink, CommonModule]
})
export class HomeComponent implements OnInit, OnDestroy {
  /** 
   * Array of Bible verses displayed in the carousel. 
   */
  verses = [
    { text: "I can do all things through Christ which strengtheneth me.", reference: "Philippians 4:13" },
    { text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.", reference: "Romans 8:28" },
    { text: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.", reference: "Isaiah 40:31" },
    { text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding.", reference: "Proverbs 3:5" },
    {
      text: "Behold, I will send you Elijah the prophet before the coming of the great and dreadful day of the LORD",
      reference: "Malachi 4:5"
    },
    {
      text: "But in the days of the voice of the seventh angel, when he shall begin to sound, the mystery of God should be finished, as he hath declared to his servants the prophets.",
      reference: "Revelation 10:7"
    },
    {
      text: "Then Peter said unto them, Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost.",
      reference: "Acts 2:38"
    },
    {
      text: "For the vision is yet for an appointed time, but at the end it shall speak, and not lie: though it tarry, wait for it; because it will surely come, it will not tarry.",
      reference: "Habakkuk 2:3"
    }
  ];

  /** Current index of the verse being displayed */
  currentVerseIndex = 0;

  /** ID for the carousel update interval to ensure cleanup */
  intervalId: any;

  ngOnInit() {
    this.startCarousel();
  }

  ngOnDestroy() {
    // Stop the interval when the component is destroyed to prevent memory leaks
    if (this.intervalId) clearInterval(this.intervalId);
  }

  /**
   * Starts an interval that rotates the current verse every 6 seconds.
   */
  startCarousel() {
    this.intervalId = setInterval(() => {
      this.currentVerseIndex = (this.currentVerseIndex + 1) % this.verses.length;
    }, 6000);
  }

  /** 
   * Convenience getter for the currently active verse object.
   */
  get currentVerse() {
    return this.verses[this.currentVerseIndex];
  }
}
