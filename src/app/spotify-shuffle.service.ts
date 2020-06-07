import { Injectable } from '@angular/core';
import { ShuffleRequest } from './shuffle-request';
import { Observable, of } from 'rxjs';
import { SpotifyService } from './spotify.service';
import { toArray, map, mergeMap, exhaust } from 'rxjs/operators';
import { PlaylistTrackObject } from './playlist';

@Injectable({
    providedIn: 'root'
})
export class SpotifyShuffleService {

    constructor(private spotify: SpotifyService) { }

    shuffle(request: ShuffleRequest): Observable<any> {
        return this.spotify.getPlaylistSongs(request.playlist.id)
            .pipe(toArray())
            .pipe(map(songs => this.shuffleSongs(songs, request.algorithm)))
            .pipe(mergeMap(songs => songs))
            .pipe(mergeMap(song => {
                return this.spotify.addItemToQueue(song.track.uri, request.device.id).pipe(mergeMap(() => of(song)));
            }, 1));
            // .pipe(exhaust());
    }

    private shuffleSongs(songs: PlaylistTrackObject[], method: string) {
        // TODO
        return songs;
    }
}
