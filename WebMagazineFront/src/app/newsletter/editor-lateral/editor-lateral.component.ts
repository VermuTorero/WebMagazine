import { Component, OnInit } from '@angular/core';
import { Lateral } from '../models/lateral';
import { LateralServiceService } from '../service/lateral.service';

@Component({
  selector: 'app-editor-lateral',
  templateUrl: './editor-lateral.component.html',
  styleUrls: ['./editor-lateral.component.css']
})
export class EditorLateralComponent implements OnInit{
  lateral: Lateral = new Lateral();

  htmlPodcastSeleccionado: string ="";
  htmlTwitterSeleccionado: string = "";
  htmlInstagramSeleccionado: string ="";
  htmlFacebookSeleccionado: string ="";


  constructor(private lateralService: LateralServiceService){

  }

  ngOnInit(): void {
    this.getLateral();
    this.showHtmlPodcast();
  }
  getLateral(){
    this.lateralService.getLateral().subscribe(lateral=>{
      this.lateral.id = this.lateralService.getId(lateral);
      this.lateral = lateral;
    })
     /*Formato de los podcast de Spotify*/
     this.lateral.htmlPodcast = this.lateral.htmlPodcast.replaceAll('<iframe style="border-radius:12px" src="https://open.spotify.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video ql-align-center" allowfullscreen="true" tipo="podcast" src="https://open.spotify.com');
     this.lateral.htmlPodcast = this.lateral.htmlPodcast.replaceAll('<iframe class="ql-video ql-align-center" src="https://open.spotify.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video ql-align-center" allowfullscreen="true" tipo="podcast" src="https://open.spotify.com');
     this.lateral.htmlPodcast = this.lateral.htmlPodcast.replaceAll('<iframe class="ql-video ql-align-center" allowfullscreen="true" src="https://open.spotify.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video ql-align-center" allowfullscreen="true" tipo="podcast" src="https://open.spotify.com');
     this.lateral.htmlPodcast = this.lateral.htmlPodcast.replaceAll('<iframe class="ql-video" src="https://open.spotify.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video ql-align-center" allowfullscreen="true" tipo="podcast" src="https://open.spotify.com');
     this.lateral.htmlPodcast = this.lateral.htmlPodcast.replaceAll('<iframe class="ql-video" allowfullscreen="true" src="https://open.spotify.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video ql-align-center" allowfullscreen="true" tipo="podcast" src="https://open.spotify.com');

     /* Cierre de iframe comun para Youtube y Spotify */
      this.lateral.htmlPodcast = this.lateral.htmlPodcast.replaceAll('</iframe>', '</iframe></div>');
     
  }
  postLateral(){
    this.lateralService.postLateral(this.lateral).subscribe(lateral=>{
      this.lateral = lateral;
    })
  }
  patchLateral(){
    this.lateralService.patchLateral(this.lateral).subscribe(lateral=>{
      this.lateral = lateral;
    })
  }
  deleteLateral(){
    this.lateralService.deleteLateral().subscribe(response=>{

    })
  }
  agregarPodcast(){
    this.htmlPodcastSeleccionado = this.htmlPodcastSeleccionado.replaceAll('height="352"', 'height="100"');
    this.lateral.htmlPodcast = this.htmlPodcastSeleccionado;
    this.showHtmlPodcast();
  }
  agregarTwitter(){
    this.lateral.htmlTwitter = this.htmlTwitterSeleccionado;
  }

  showHtmlPodcast() {
    var podcastContainer = document.querySelector("#podcast");
    var html = document.createElement("div");
    html.innerHTML = this.htmlPodcastSeleccionado;
    podcastContainer?.appendChild(html);
    console.log(html.innerHTML)
  }

  guardarCambios(){
    if(this.lateral.id){
      this.lateralService.patchLateral(this.lateral).subscribe(lateral=>{
        this.lateral = lateral;
      })
    }else{
      this.lateralService.postLateral(this.lateral).subscribe(lateral=>{
        this.lateral = lateral;
        this.lateral.id = this.lateralService.getId(lateral);
      })

    }
    
  }

}
