import {Component, OnInit} from '@angular/core';
import {YoutubePlayerComponent} from 'ngx-youtube-player';
import {ActivatedRoute, Router, RouterLink, RouterModule} from '@angular/router';
import {Videogame} from '../../../Model/Interfaces/videogame';
import {VideojuegosService} from '../../../services/videojuegos.service';
import {FormsModule} from '@angular/forms';
import {KnobModule} from 'primeng/knob';
import {CardModule} from 'primeng/card';
import { ListReviewComponent } from "../../list-review/list-review.component";

@Component({
  selector: 'app-videogame-banner',
  standalone: true,
  imports: [YoutubePlayerComponent, KnobModule, FormsModule, CardModule, RouterLink,RouterModule],
  templateUrl: './videogame-banner.component.html',
  styleUrl: './videogame-banner.component.css'
})
export class VideogameBannerComponent implements OnInit{

  value: number = 4.5;
  player!: YT.Player;
   id!: string;
  videogame!: Videogame;
   constructor(private ActivatedRoute: ActivatedRoute,
               private videogameService: VideojuegosService) {

   }

   ngOnInit() {
    this.id = this.ActivatedRoute.snapshot.params['videogameId'];
    if(this.id) {
      this.videogameService.getById(this.id).subscribe(videogame => {
        this.videogame = videogame;
        this.value = videogame.globalScore*100;
      })
    }

   }

  savePlayer(player: YT.Player) {
       this.player = player;
  }
  onStateChange(event: any) {
    console.log("player state", event.data);
  }
  

}
