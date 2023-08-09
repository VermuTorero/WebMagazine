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

  constructor(private clicksService: ClicksService,
    private categoriaService: CategoriasServiceService) {}

  ngOnInit(): void {
    this.getClicks();
  }

  // ...
  getClicks(){
    this.clicksService.getClicks().subscribe(clicks=>{
      clicks.forEach(click => {
        click.id = this.clicksService.getId(click);
      });
      this.clicks = clicks;
      console.log("CLICKS: ", this.clicks);
      this.prepareChartData();
    })
  }

  // Método para preparar los datos para el gráfico
  private prepareChartData() {
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
    this.chartLabels = topCategories;
    this.chartData = topCategories.map(category => categoryFrequency[category]);

    console.log("LABELS: ", this.chartLabels);
    console.log("DATOS: ", this.chartData)
    // Llamar a la función para dibujar el gráfico
    this.drawChart();
  }

  // Método para dibujar el gráfico
  private drawChart() {
    const ctx = document.getElementById('categoryChart') as HTMLCanvasElement;
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.chartLabels,
        datasets: [
          {
            data: this.chartData,
            backgroundColor: ['red', 'blue', 'green', 'yellow', 'orange'], // Puedes personalizar los colores
            borderWidth: 1
          }
        ]
      }
    });
  }
}