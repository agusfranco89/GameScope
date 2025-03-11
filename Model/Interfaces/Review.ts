export interface Review {
  id?: string;
  videojuegoId: string;    // ID del videojuego reseñado
  usuarioId: string;       // ID del usuario que escribió la reseña
  titulo: string;          // Título de la reseña
  puntuacionGraficos: number | any,   // Calificaciones del videojuego
  comentarioGraficos: string,
  puntuacionJugabilidad: number| any,
  comentarioJugabilidad: string,
  puntuacionPrecioCalidad: number| any,
  comentarioPrecioCalidad: string,
  calificacionGlobal: number | any;    // Calificación del videojuego
  contenido: string;       // Contenido de la reseña
  fechaCreacion: Date;     // Fecha de creación de la reseña
  comentarios?: Comment[]; // Comentarios de otros usuarios (opcional)
}

export interface Comment {
  id: number;             // Identificador único del comentario
  reviewId: number;       // ID de la reseña a la que pertenece el comentario
  usuarioId: number;      // ID del usuario que escribió el comentario
  contenido: string;      // Contenido del comentario
  fecha: Date;            // Fecha en la que se escribió el comentario
}
