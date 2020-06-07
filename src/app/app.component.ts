import { Component, OnInit } from '@angular/core';
import { SpotifyService } from './spotify.service';
import { ShuffleRequest } from './shuffle-request';
import { SpotifyShuffleService } from './spotify-shuffle.service';
import { PlaylistTrackObject } from './playlist';

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

    onShuffleRequested(request: ShuffleRequest): void {
        this.shuffleRequest = request;
        this.shuffleService.shuffle(request).subscribe(song => this.songs.push(song));
    }
}
