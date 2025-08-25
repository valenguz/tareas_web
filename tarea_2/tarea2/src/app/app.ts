import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('tarea2');
  
  player1 = signal({ name: '', health: 10 });
  player2 = signal({ name: '', health: 10 });
  resultado = signal('');
  juegoIniciado = signal(false);

  constructor() {
    this.solicitarNombres();
  }

  solicitarNombres() {
    const nombre1 = prompt('Ingrese el nombre del jugador 1');
    const nombre2 = prompt('Ingrese el nombre del jugador 2');
    
    if (nombre1 && nombre2) {
      this.player1.set({ ...this.player1(), name: nombre1 });
      this.player2.set({ ...this.player2(), name: nombre2 });
      this.juegoIniciado.set(true);
    }
  }

  lanzarDado(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  jugarRonda() {
    if (this.player1().health <= 0 || this.player2().health <= 0) {
      if (this.player1().health <= 0 && this.player2().health <= 0) {
        alert('Empate, ambos sin vidas');
      } else if (this.player1().health <= 0) {
        alert(`${this.player1().name} perdió \n${this.player2().name} gano`);
      } else if (this.player2().health <= 0) {
        alert(`${this.player2().name} perdió \n${this.player1().name} gano `);
      }
      return;
    }

    const dado1 = this.lanzarDado();
    const dado2 = this.lanzarDado();
    let mensaje = `${this.player1().name} sacó ${dado1} & ${this.player2().name} sacó ${dado2}`;

    if (dado1 > dado2) {
      const nuevoHealth = this.player2().health - (dado1 - dado2);
      this.player2.set({ ...this.player2(), health: nuevoHealth < 0 ? 0 : nuevoHealth });
      mensaje += ` → ${this.player2().name} pierde ${dado1 - dado2} vidas`;
    } else if (dado2 > dado1) {
      const nuevoHealth = this.player1().health - (dado2 - dado1);
      this.player1.set({ ...this.player1(), health: nuevoHealth < 0 ? 0 : nuevoHealth });
      mensaje += ` → ${this.player1().name} pierde ${dado2 - dado1} vidas`;
    } else {
      mensaje += " → Empate, nadie pierde vidas";
    }

    this.resultado.set(mensaje);

    if (this.player1().health <= 0) {
      setTimeout(() => {
        alert(`${this.player2().name} gana`);
      }, 100);
    } else if (this.player2().health <= 0) {
      setTimeout(() => {
        alert(`${this.player1().name} gana`);
      }, 100);
    }
  }

  generarCorazones(cantidad: number): string {
    return '❤️'.repeat(cantidad);
  }

  reiniciarJuego() {
    this.player1.set({ name: this.player1().name, health: 10 });
    this.player2.set({ name: this.player2().name, health: 10 });
    this.resultado.set('');
  }
}