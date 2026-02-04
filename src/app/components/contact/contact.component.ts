import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  formData: ContactForm = {
    name: '',
    email: '',
    message: ''
  };

  submitted = false;
  currentDate = new Date();  // Add this line

  onSubmit(): void {
    if (this.formData.name && this.formData.email && this.formData.message) {
      this.submitted = true;
      this.currentDate = new Date();  // Update the date on each submit
      console.log('Form submitted:', this.formData);
    }
  }

  resetForm(): void {
    this.formData = {
      name: '',
      email: '',
      message: ''
    };
    this.submitted = false;
  }
}
