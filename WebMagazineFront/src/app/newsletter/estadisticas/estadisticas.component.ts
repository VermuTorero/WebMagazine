import { Component, OnInit } from '@angular/core';
import { ClicksService } from '../service/clicks.service';
import { Click } from '../models/Click';
import { CategoriasServiceService } from '../service/categorias.service';
import { Chart } from 'chart.js/auto';


@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {
  clicks: Click[] = [];

  // Agrega propiedades para almacenar los datos del gráfico
  chartLabels: string[] = [];
  chartData: number[] = [];

  tagChartLabels: string[] = [];
  tagChartData: number[] = [];
  myChart: any;
  tiempo: string ="";
  tipo: string = "";


  constructor(private clicksService: ClicksService,
    private categoriaService: CategoriasServiceService) { }

  ngOnInit(): void {
    this.tiempo = '365';
    this.tipo = 'tags';
    this.getClicks();

  }

  getClicks(){
    if (this.tipo=='tags') {
      this.getClicksTags();
    }
    if(this.tipo=='categorias'){
      this.getClicksCategorias();
    }
  }

  getClicksTags() {
    this.clicksService.getClicksSince(this.tiempo).subscribe(clicks => {
      clicks.forEach(click => {
        click.id = this.clicksService.getId(click);
        this.clicksService.getTagsFromClick(click).subscribe(tags => {
          tags.forEach(tag => {
            tag.id = this.clicksService.getId(tag);
          });
          click.tagsClick = tags;  
          if (click === clicks[clicks.length - 1]) {
            this.prepareChartDataTags(clicks);
          }  
        })  
      });
 
      this.clicks = clicks;
      console.log("CLICKS: ", this.clicks);
    });
  }

  private prepareChartDataTags(clicks: Click[]) {
    console.log(clicks)
    // Generar un objeto de frecuencia para los tags
    const tagFrequency: any = {};
    clicks.forEach(click => {
      if (click.tagsClick) {
        click.tagsClick.forEach(tag => {
          if (tagFrequency[tag.tagNombre]) {
            tagFrequency[tag.tagNombre]++;
          } else {
            tagFrequency[tag.tagNombre] = 1;
          }
        });
      } 
    });

    console.log("FRECUENCIA TAGS: ", tagFrequency);

    // Ordenar los tags por frecuencia descendente y limitar a los top 5
    const sortedTags = Object.keys(tagFrequency).sort(
      (a, b) => tagFrequency[b] - tagFrequency[a]
    );

    const topTags = sortedTags.slice(0, 5);

    // Preparar los datos para el gráfico de tags
    let tagChartLabels = topTags;
     let tagChartData = topTags.map(tag => tagFrequency[tag]);

   
    // Llamar a la función para dibujar el gráfico de tags
    this.drawChart(tagChartLabels, tagChartData);
  }




  // ...
  getClicksCategorias() {
    this.clicksService.getClicksSince(this.tiempo).subscribe(clicks => {
      clicks.forEach(click => {
        click.id = this.clicksService.getId(click);
      });
      this.clicks = clicks;
      console.log("CLICKS: ", this.clicks);
      this.prepareChartDataCategorias();
    })
  }

  // Método para preparar los datos para el gráfico
  private prepareChartDataCategorias() {
    // Generar un objeto de frecuencia para las categorías
    const categoryFrequency: any = {};

    for (const click of this.clicks) {
      if (click.categoriaClick && click.categoriaClick.categoriaNombre) {
        const categoryName = click.categoriaClick.categoriaNombre;
        if (categoryFrequency[categoryName]) {
          categoryFrequency[categoryName]++;
        } else {
          categoryFrequency[categoryName] = 1;
        }
      }

    }
    console.log("FRECUENCIA CATEGORIA: ", categoryFrequency)
    // Ordenar las categorías por frecuencia descendente y limitar a las top 5
    const sortedCategories = Object.keys(categoryFrequency).sort(
      (a, b) => categoryFrequency[b] - categoryFrequency[a]
    );

    const topCategories = sortedCategories.slice(0, 5);

    // Preparar los datos para el gráfico
    let chartLabels = topCategories;
    let chartData = topCategories.map(category => categoryFrequency[category]);

    console.log("LABELS: ", this.chartLabels);
    console.log("DATOS: ", this.chartData)
    // Llamar a la función para dibujar el gráfico
    this.drawChart(chartLabels, chartData);
  }


  // Método para dibujar el gráfico
  private drawChart(labels: string[], data: string[]) {
    const ctx = document.getElementById('categoryChart') as HTMLCanvasElement;
    if (this.myChart) {
      this.myChart.destroy();
    }
    this.myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: ['red', 'blue', 'green', 'yellow', 'orange'], // Puedes personalizar los colores
            borderWidth: 1
          }
        ]
      }
    });
  }
  setTime(tiempo: string){
    this.tiempo = tiempo;
    this.getClicks();
  }
  setType(tipo: string){
    this.tipo = tipo;
    this.getClicks();
  }
}