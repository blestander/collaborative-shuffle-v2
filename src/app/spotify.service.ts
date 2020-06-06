import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const fragmentRegex = /access_token=(.*)&/

@Injectable({
    providedIn: 'root'
})
export class SpotifyService {

    constructor(private route: ActivatedRoute) { }

    authorizeIndirectGrant(redirect_uri: string, client_id: string, scope: string[] = []): void {
        let encodedScope = encodeURI(scope.join(" "));
        let url = `https://accounts.spotify.com/authorize?response_type=token&redirect_uri=${redirect_uri}&client_id=${client_id}&scope=${encodedScope}`;
        location.assign(url);
    }

    get loggedIn(): Observable<boolean> {
        return this.accessToken.pipe(map(token => token.length > 0));
    }

    private get accessToken(): Observable<string> {
        return this.route.fragment.pipe(map(fragment => {
            let result = fragmentRegex.exec(fragment);
            if (result)
                return result[1];
            else
                return "";
        }));
    }
}
