import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({ providedIn: 'root' })
export class GifsService {

  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private apiKey: string = "bfUivkJOhErcAKRWOQFyy7cIv654o5f6";
  private serviceUrl: string = `https://api.giphy.com/v1/gifs`

  constructor( private http: HttpClient) {
    this.loadLocalStorage();
    this.searchTag(this._tagsHistory[0])
    console.log('Gifs Service Ready');
  }

  get tagsHistory() {
    return [...this._tagsHistory]
  }

  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();

    if ( this._tagsHistory.includes( tag ) ) {
      this._tagsHistory = this._tagsHistory.filter( (oldTag) => oldTag !== tag );
    }

    this._tagsHistory.unshift( tag );
    this._tagsHistory = this.tagsHistory.splice(0,10);
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify( this._tagsHistory ));
  }

  private loadLocalStorage(): void {
    if( !localStorage.getItem('history') ) return
    this._tagsHistory = JSON.parse( localStorage.getItem('history')! );

    if( this._tagsHistory.length === 0 ) return
  }

  searchTag( tag: string ): void {
    if(tag.length === 0) return
    this.organizeHistory(tag)

    const rest = `?api_key=${this.apiKey}&q=${tag}t&limit=10`

    this.http.get<SearchResponse>(`${this.serviceUrl}/search${rest}`)
      .subscribe( ({ data }) => {
        this.gifList = data;
    })

  }
}

