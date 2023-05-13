import { Component, OnInit } from '@angular/core';
import { Lateral } from '../models/lateral';
import { LateralServiceService } from '../service/lateral.service';
import { TwitterService } from '../service/twitter.service';
declare const twttr: any;


@Component({
  selector: 'app-editor-lateral',
  templateUrl: './editor-lateral.component.html',
  styleUrls: ['./editor-lateral.component.css']
})
export class EditorLateralComponent implements OnInit{
  lateral: Lateral = new Lateral();

  htmlPodcastSeleccionado: string ="";
  htmlTwitterSeleccionado: string = "";
  htmlTwitter2Seleccionado: string ="";
  htmlTwitter3Seleccionado: string ="";


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
      this.htmlTwitter2Seleccionado = this.lateral.htmlTwitter2;
      this.htmlTwitter3Seleccionado = this.lateral.htmlTwitter3;
      this.showHtmlPodcast();
      this.showHtmlTwitter();
      this.showHtmlTwitter2();
      this.showHtmlTwitter3();
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

  showHtmlPodcastSM() {
    var podcastContainer = document.querySelector("#podcastSM");
    var html = document.createElement("div");
    html.innerHTML = this.lateral.htmlPodcast;
    podcastContainer?.appendChild(html);
    console.log(html.innerHTML)
  }

  agregarTwitter(){
    var twitter = document.querySelector('#twitter');
    var tweet = document.querySelector('tweet');
    if (tweet) {
      twitter?.removeChild(tweet);
    }
    this.lateral.htmlTwitter = this.htmlTwitterSeleccionado;
    this.guardarCambios();
  }
  agregarTwitter2(){
    var twitter2 = document.querySelector('#twitter2');
 /*    var tweet = document.querySelector('tweet');
    if (tweet) {
      twitter?.removeChild(tweet);
    } */
    this.lateral.htmlTwitter2 = this.htmlTwitter2Seleccionado;
    this.guardarCambios();
  }
  agregarTwitter3(){
    var twitter3 = document.querySelector('#twitter3');
    /* var tweet = document.querySelector('tweet');
    if (tweet) {
      twitter?.removeChild(tweet);
    } */
    this.lateral.htmlTwitter3 = this.htmlTwitter3Seleccionado;
    this.guardarCambios();
  }
  showHtmlTwitter() {
    var twitterContainer = document.querySelector("#twitter");
    var tweet = document.createElement('div');
    tweet.innerHTML = this.htmlTwitterSeleccionado;
    twitterContainer?.appendChild(tweet);
    twttr.widgets.load()
  }
  showHtmlTwitter2() {
    var twitterContainer = document.querySelector("#twitter2");
    var tweet = document.createElement('div');
    tweet.innerHTML = this.htmlTwitter2Seleccionado;
    twitterContainer?.appendChild(tweet);
    twttr.widgets.load()
  }
  showHtmlTwitter3() {
    var twitterContainer = document.querySelector("#twitter3");
    var tweet = document.createElement('div');
    tweet.innerHTML = this.htmlTwitter3Seleccionado;
    twitterContainer?.appendChild(tweet);
    twttr.widgets.load()
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
