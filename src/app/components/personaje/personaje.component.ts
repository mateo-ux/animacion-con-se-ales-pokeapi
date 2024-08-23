import { Component, computed, effect, Inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { PokeapiService } from '../../services/pokeapi.service';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-personaje',
  standalone: true,
  imports: [MaterialModule, MatDialogTitle, MatDialogContent, HttpClientModule],
  providers: [PokeapiService],
  templateUrl: './personaje.component.html',
  styleUrl: './personaje.component.css'
})
export default class PersonajeComponent implements OnInit, OnDestroy{

  animationArray = signal<string[]>([]);
  pokemonNameOrId = signal('')
  indiceActual = signal(0);
  loading = signal(false);
  pokemonData = signal<any>(null);
  animating = signal(false);


  personaje: any;

  imagenActual = computed(() => {
    const array = this.animationArray();
    return array.length > 0 ? array[this.indiceActual()] : '';
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private Pok: PokeapiService,
    private pokemonService: PokeapiService,
    private _snackBar: MatSnackBar
  ){
    effect(() => {
      if (this.animating()) {
        this.animateFrames();
      }
    });
  }

  ngOnInit(): void {
    if (this.data && this.data.nameOrId) {
      this.updateName(this.data.nameOrId);
      this.loadPokemon();
    } else {
      this.openSnackSinData();
    }
  }
  

    ngOnDestroy(): void {
      this.detenerAnimacion();
    }

    loadPokemon(){
        this.detenerAnimacion();
        this.loading.set(true);
        this.pokemonService.getPokemon(this.pokemonNameOrId()).subscribe({
          next: (pokemon: any) =>{  
            this.pokemonData.set(pokemon);
            this.loading.set(false);
            console.log(this.pokemonData());
            this.animationArray.set([
              pokemon.sprites.front_default,
              pokemon.sprites.back_default
            ]);
            console.log("arriba");
            this.iniciarAnimacion();
            console.log("abajo");
            this.playSound(this.pokemonData().cries.latest)
          },
          error: (err: any) =>{ 
            console.log(err)
            this.openSnackBarError()
            this.loading.set(false)
          }
        })
    }

    openSnackBarError() {
      this._snackBar.open( 'Nombre o id de pokemon no válido', 'Cerrar', {duration: 3000} );
    }
  
    openSnackSinData() {
      this._snackBar.open( 'Escriba un nombre o id para cargar', 'Cerrar', {duration: 3000} );
    }

    playSound(soundSource: string){
      const audio = new Audio();
      audio.src = soundSource;
      audio.load();
      audio.play();
    }

    iniciarAnimacion() {
      this.indiceActual.set(0);
      this.animating.set(true);
    }

    animateFrames() {
      setTimeout(() => {
        if (this.animating()) {
          this.indiceActual.update(index => (index + 1) % this.animationArray().length);
          this.animateFrames();
        }
      }, 300);
    }


  detenerAnimacion() {
    this.animating.set(false);
  }

  updateName(name: string) {
    this.pokemonNameOrId.set(name.toLocaleLowerCase());
  }
}