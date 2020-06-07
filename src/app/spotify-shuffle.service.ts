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
        switch (method) {
            case "true-shuffle":
                return this.shuffleTrueShuffle(songs);
            case "perfect-mix":
                return songs;
            case "pass-through":
            default:
                return songs;
        }
    }

    private shuffleTrueShuffle(songs: PlaylistTrackObject[]) {
        for (let i = songs.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let swap = songs[i];
            songs[i] = songs[j];
            songs[j] = swap;
        }
        return songs;
    }
}
