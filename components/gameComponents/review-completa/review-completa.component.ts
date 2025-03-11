import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VideojuegosService } from '../../../services/videojuegos.service';
import { Review } from '../../../Model/Interfaces/Review';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { Videogame } from '../../../Model/Interfaces/videogame';

@Component({
  selector: 'app-review-completa',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, RatingModule, CommonModule],
  templateUrl: './review-completa.component.html',
  styleUrls: ['./review-completa.component.css']
})
export class ReviewCompletaComponent implements OnInit {
  videojuego: Videogame | undefined;
  reviewSeleccionada: Review | null = null; // Variable para almacenar la reseña seleccionada

  constructor(
    private route: ActivatedRoute,
    private videojuegosService: VideojuegosService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('videogameId');
    if (id) {
      this.videojuegosService.getById(id).subscribe((data) => {
        this.videojuego = data;
      });
    }
  }





  // Método para seleccionar una reseña
  seleccionarReview(review: Review): void {
    this.reviewSeleccionada = review;
  }

  // Método para volver a la lista de reseñas
  volverALista(): void {
    this.reviewSeleccionada = null;
  }
}
