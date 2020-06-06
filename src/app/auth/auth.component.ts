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
            "5ac550d329b64aba9bea1ee3a2dd3969",
            ["playlist-read-private", "playlist-read-collaborative", "user-modify-playback-state"],
        );
    }

}
