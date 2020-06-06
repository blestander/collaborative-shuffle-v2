import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SpotifyService {

    constructor() { }

    authorizeIndirectGrant(redirect_uri: string, client_id: string, scope: string[] = []): void {
        let encodedScope = encodeURI(scope.join(" "));
        let url = `https://accounts.spotify.com/authorize?response_type=token&redirect_uri=${redirect_uri}&client_id=${client_id}&scope=${encodedScope}`;
        location.assign(url);
    }
}
