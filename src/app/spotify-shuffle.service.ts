import { Injectable } from '@angular/core';
import { ShuffleRequest } from './shuffle-request';
import { Observable } from 'rxjs';
import { SpotifyService } from './spotify.service';

@Injectable({
    providedIn: 'root'
})
export class SpotifyShuffleService {

    constructor(private spotify: SpotifyService) { }

    shuffle(request: ShuffleRequest): Observable<any> {
        return this.spotify.getPlaylistSongs(request.playlist.id);
    }
}
