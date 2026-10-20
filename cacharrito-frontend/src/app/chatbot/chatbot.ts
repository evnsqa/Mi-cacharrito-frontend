import { Component } from '@angular/core';

interface ChatMessage {
  author: 'bot' | 'user';
  text: string;
}

interface ChatQuestion {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css',
})
export class ChatbotComponent {
  abierto = false;
  mensajes: ChatMessage[] = [];

  readonly preguntas: ChatQuestion[] = [
    {
      question: '¿Cómo me registro?',
      answer:
        'Abre “Registrarse” y completa tus datos personales, correo, teléfono e información de tu licencia de conducción. Después podrás iniciar sesión.',
    },
    {
      question: '¿Cómo puedo alquilar un vehículo?',
      answer:
        'Inicia sesión, entra al Catálogo, elige un tipo de vehículo y selecciona uno disponible. En la pantalla de alquiler indica las fechas y confirma la solicitud. Quedará pendiente de aprobación; cuando administración la apruebe, podrás completar el pago y coordinar la entrega.',
    },
    {
      question: '¿Dónde veo mis alquileres?',
      answer:
        'Después de iniciar sesión, selecciona el ícono del carrito de compras ubicado en la parte superior derecha. Allí podrás consultar tus alquileres y usar la opción de cancelar cuando esté disponible.',
    },
    {
      question: '¿Qué significa “pendiente de entrega”?',
      answer:
        'Significa que la solicitud fue registrada y el vehículo aún no ha sido marcado como entregado por el personal de Cacharrito.',
    },
    {
      question: '¿Cómo contacto a Cacharrito?',
      answer:
        'Puedes consultar los datos de contacto y la ubicación de Cacharrito en la página “Contacto”. Selecciona esa opción en el menú superior para ver la información y el mapa.',
    },
  ];

  alternarChat(): void {
    this.abierto = !this.abierto;
  }

  seleccionarPregunta(pregunta: ChatQuestion): void {
    this.mensajes = [
      ...this.mensajes,
      { author: 'user', text: pregunta.question },
      { author: 'bot', text: pregunta.answer },
    ];
  }

  reiniciarChat(): void {
    this.mensajes = [];
  }
}
