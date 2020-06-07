import { Injectable } from '@angular/core';
import { ShuffleRequest } from './shuffle-request';
import { Observable, of } from 'rxjs';
import { SpotifyService } from './spotify.service';
import { toArray, map, mergeMap} from 'rxjs/operators';
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
    }

    private shuffleSongs(songs: PlaylistTrackObject[], method: string) {
        switch (method) {
            case "true-shuffle":
                return this.shuffleTrueShuffle(songs);
            case "perfect-mix":
                return this.shufflePerfectCollaboratorMix(songs);
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

    private shufflePerfectCollaboratorMix(songs: PlaylistTrackObject[]) {
        let results: PlaylistTrackObject[] = [];

        // Make the buckets
        let buckets: Buckets = this.bucketSongs(songs);

        // While there are still buckets
        while (Object.keys(buckets).length > 0) {
            // Grab a song from each bucket
            let round = [];
            for (const user of Object.keys(buckets))
                round.push(buckets[user].pop());

            // Shuffle the round
            round = this.shuffleTrueShuffle(round);

            // Insert the shuffled round into results
            results.splice(results.length, 0, ...round);

            // Drop empty buckets
            for (const user of Object.keys(buckets))
                if (buckets[user].length == 0)
                    delete buckets[user];
        }

        return results;
    }

    private bucketSongs(songs: PlaylistTrackObject[]): Buckets {
        // Make buckets
        let buckets = {};
        for (const song of songs) {
            let user_id = song.added_by.id;
            if (buckets[user_id]) // Bucket exists
                buckets[user_id].push(song);
            else // Bucket needs to be made
                buckets[user_id] = [ song ];
        }

        // Shuffle buckets
        for (const id of Object.keys(buckets))
            buckets[id] = this.shuffleTrueShuffle(buckets[id]);
        return buckets;
    }
}

interface Buckets {
    [key: string]: PlaylistTrackObject[]
}
