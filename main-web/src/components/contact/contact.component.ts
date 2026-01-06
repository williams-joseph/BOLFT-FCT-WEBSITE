import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../services/contact.service';

@Component({
  standalone: true,
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ContactComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly contactService = inject(ContactService);

  readonly contactForm = this.fb.group({
    name: ['', Validators.required],
    phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9+ ]{10,15}$')]],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });
  readonly submissionStatus = signal<'idle' | 'submitting' | 'success' | 'error'>('idle');

  get name() { return this.contactForm.get('name'); }
  get phoneNumber() { return this.contactForm.get('phoneNumber'); }
  get message() { return this.contactForm.get('message'); }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.submissionStatus.set('submitting');
    this.contactService.saveContactMessage(this.contactForm.getRawValue() as any)
      .then(() => {
        this.submissionStatus.set('success');
        this.contactForm.reset();
      })
      .catch(() => {
        this.submissionStatus.set('error');
      });
  }
}
