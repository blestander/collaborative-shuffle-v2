import { Component, OnInit } from '@angular/core';
import { SpotifyService } from './spotify.service';
import { ShuffleRequest } from './shuffle-request';
import { SpotifyShuffleService } from './spotify-shuffle.service';
import { PlaylistTrackObject } from './playlist';
import { bufferCount, delayWhen } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'spotify-collaborative-shuffle';

    loggedIn: boolean;
    shuffleRequest: ShuffleRequest = null;
    songs: PlaylistTrackObject[] = [];

    constructor (
        public spotify: SpotifyService,
        private shuffleService: SpotifyShuffleService
    ) { }

    ngOnInit(): void {
        this.spotify.loggedIn.subscribe(loggedIn => this.loggedIn = loggedIn);
    }

    requestTotalSongs(): number {
        return this.shuffleRequest.playlist.tracks.total;
    }

    onShuffleRequested(request: ShuffleRequest): void {
        this.shuffleRequest = request;
        const shuffledSongs$ = this.shuffleService.shuffle(request);
        const bufferedShuffledSongs$ = shuffledSongs$.pipe(bufferCount(100));
        const newPlaylist$ = this.spotify.createPlaylist(
            `Shuffled: ${request.playlist.name}`,
            [
                `Shuffled copy of ${request.playlist.name} created at ${new Date(Date.now()).toString()}.`,
                `Original playlist: ${request.playlist.href}`
            ].join('\n'),
        );
        const playlistAndSongs$ = combineLatest([newPlaylist$, bufferedShuffledSongs$]);
        playlistAndSongs$.pipe(
            // Add songs to playlist and delay visual output until complete
            delayWhen(([playlist, tracks]) => this.spotify.addItemsToPlaylist(
                playlist.id,
                tracks.map(track => track.track.uri)
            ))
        ).subscribe({
            next: ([playlist, songs]) => this.songs = this.songs.concat(songs)
        });
    }

    onMenuRequested() {
        this.shuffleRequest = null;
        this.songs = [];
    }
}
