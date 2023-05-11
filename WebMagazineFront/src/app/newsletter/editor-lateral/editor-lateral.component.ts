import { Component, OnInit } from '@angular/core';
import { Lateral } from '../models/lateral';
import { LateralServiceService } from '../service/lateral.service';
import { TwitterService } from '../service/twitter.service';


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


  constructor(private lateralService: LateralServiceService, 
    private twitterService: TwitterService){
  }

  ngOnInit(): void {
    this.getLateral();
    
  }

  getLateral(){
    this.lateralService.getLateral().subscribe(lateral=>{
      this.lateral = lateral;
      this.lateral.id = this.lateralService.getId(lateral);
      this.htmlPodcastSeleccionado = this.lateral.htmlPodcast;
      this.htmlTwitterSeleccionado = this.lateral.htmlTwitter;
      this.showHtmlPodcast();
      this.showHtmlTwitter();
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
    this.guardarCambios();
  }
  
  showHtmlPodcast() {
    var podcastContainer = document.querySelector("#podcast");
    var html = document.createElement("div");
    html.innerHTML = this.lateral.htmlPodcast;
    podcastContainer?.appendChild(html);
    console.log(html.innerHTML)
  }

  agregarTwitter(){
    var twitter = document.querySelector('#twitter');
    var tweet = document.querySelector('div');
    if (tweet) {
      twitter?.removeChild(tweet);
    }
    this.lateral.htmlTwitter = this.htmlTwitterSeleccionado;
    this.guardarCambios();
  }

  showHtmlTwitter() {
    var twitterContainer = document.querySelector("#twitter");
    var tweet = document.createElement('tweet');
    tweet.innerHTML = this.htmlTwitterSeleccionado;
    twitterContainer?.appendChild(tweet);
  }

  guardarCambios(){
    if(this.lateral.id){
      this.lateralService.patchLateral(this.lateral).subscribe(lateral=>{
        this.lateral = lateral;
        location.reload();
      })
    }else{
      this.lateralService.postLateral(this.lateral).subscribe(lateral=>{
        this.lateral = lateral;
        this.lateral.id = this.lateralService.getId(lateral);
      })
    }
  }

}
