import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { PokeapiService } from '../../services/pokeapi.service';
import { MaterialModule } from '../../material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import  PersonajeComponent  from '../personaje/personaje.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-lista-personajes',
  standalone: true,
  imports: [
    MaterialModule,
    HttpClientModule,
    MatGridListModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
  ],
  providers: [PokeapiService],
  templateUrl: './lista-personajes.component.html',
  styleUrl: './lista-personajes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListaPersonajesComponent implements OnInit, OnDestroy{

  @ViewChild('pokemonName') pokemonNameInput!: ElementRef;

  pokemonNameOrId = signal('')
  loading = signal(false);
  pokemonData = signal<any>(null);
  animationArray = signal<string[]>([]);
  indiceActual = signal(0);
  animating = signal(false);

  listaPersonajes: any = {};

  imagenActual = computed(() => {
    const array = this.animationArray();
    return array.length > 0 ? array[this.indiceActual()] : '';
  });

  constructor(
    private Pok: PokeapiService,
    private dialog: MatDialog,
    private urlNext: PokeapiService,
    private pokemonService: PokeapiService,
    private _snackBar: MatSnackBar,
    private pokeapiService: PokeapiService
    ){
      effect(() => {
        if (this.animating()) {
          this.animateFrames();
        }
      });
    }
    loadAndOpenDialog(pokemonNameOrId: string): void {
    if (pokemonNameOrId) {
      this.pokeapiService.getPokemon(pokemonNameOrId.toLowerCase()).subscribe({
        next: (pokemon: any) => {
          this.dialog.open(PersonajeComponent, {
            data: { nameOrId: pokemonNameOrId }
          });
        },
        error: (err: any) => {
          console.log(err);
          this.openSnackBarError();
        }
      });
    } else {
      this.openSnackSinData();
    }
  }

    openSnackSinData() {
      // Aquí se puede reutilizar el código del `PersonajeComponent` para mostrar un error
    }

    ngOnInit(): void {
      this.Pok.obtenerPersonajes().subscribe({
      next: (data: any) => {
        this.listaPersonajes = data;
        console.log(this.listaPersonajes)
      },
      error: (err: any) => {
        console.log(err);
      }
      })
    }

    updateNameClick(name: string) {
      this.pokemonNameOrId.set(name.toLocaleLowerCase());
      console.log(name + " click")
      this.loadPokemon()
    }

    openDialog(pokemonNameOrId: string): void {
      this.dialog.open(PersonajeComponent, {
        data: { nameOrId: pokemonNameOrId }
      });
      this.updateNameClick(pokemonNameOrId);
    }

    ngOnDestroy(): void {
      this.detenerAnimacion();
    }

    playSound(soundSource: string){
      const audio = new Audio();
      audio.src = soundSource;
      audio.load();
      audio.play();
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
            this.iniciarAnimacion();
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
