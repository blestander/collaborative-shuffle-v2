import { Component, OnInit } from '@angular/core';
import { SpotifyService } from './spotify.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'spotify-collaborative-shuffle';

    loggedIn: boolean;

    constructor (public spotify: SpotifyService) { }

    ngOnInit(): void {
        this.spotify.loggedIn.subscribe(loggedIn => this.loggedIn = loggedIn);
    }
}
