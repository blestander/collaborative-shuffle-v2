import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../spotify.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

    constructor(private spotify: SpotifyService) { }

    ngOnInit(): void {
    }

    authorize(): void {
        this.spotify.authorizeIndirectGrant(
            location.href,
            [
                "playlist-read-private",
                "playlist-read-collaborative",
                'playlist-modify-private',
                "user-read-playback-state",
                "user-modify-playback-state"
            ],
        );
    }

}
