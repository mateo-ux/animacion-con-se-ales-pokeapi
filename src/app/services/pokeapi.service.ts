import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokeapiService {

  
  private UrlBase = 'https://pokeapi.co/api/v2'

  constructor(private http: HttpClient) { }
  
  obtenerPersonajes(){
    return this.http.get(`${this.UrlBase}/pokemon`)
  }

  obtenerUnPersonaje(id: string){
    return this.http.get(`${this.UrlBase}/pokemon/${id}/`)
  }
  getPokemon(nameOrId: string): Observable<any> {
    return this.http.get(`${this.UrlBase}/pokemon/${nameOrId}/`);
  }

  
}
