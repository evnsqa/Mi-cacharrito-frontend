import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './footer/footer';
import { ChatbotComponent } from './chatbot/chatbot';

@Component({
  imports: [RouterOutlet, Footer, ChatbotComponent],

  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  constructor() {
    // Bootstrap's interactive components are loaded separately from the initial bundle.
    void import('bootstrap');
  }
}
