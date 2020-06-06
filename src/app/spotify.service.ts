import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, pluck, tap, exhaust } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Device } from './device';

const fragmentRegex = /access_token=(.*)&/

@Injectable({
    providedIn: 'root'
})
export class SpotifyService {

    constructor(
        private http: HttpClient,
        private route: ActivatedRoute
    ) { }

    authorizeIndirectGrant(redirect_uri: string, client_id: string, scope: string[] = []): void {
        let encodedScope = encodeURI(scope.join(" "));
        let url = `https://accounts.spotify.com/authorize?response_type=token&redirect_uri=${redirect_uri}&client_id=${client_id}&scope=${encodedScope}`;
        location.assign(url);
    }

    get loggedIn(): Observable<boolean> {
        return this.accessToken.pipe(map(token => token.length > 0));
    }

    get devices(): Observable<Device[]> {
        return this.accessToken.pipe(map(token => {
            return this.http.get<DeviceResponse>(
                "https://api.spotify.com/v1/me/player/devices",
                {
                    headers: this.authHeader(token)
                }
            );
        })) // Returns Observable<Observable<DeviceResponse>>
            .pipe(exhaust()) // Returns Observable<DeviceResponse>
            .pipe(pluck('devices')); // Returns Observable<Device[]>
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

    private authHeader(token: string) {
        return {
            'Authorization': `Bearer ${token}`
        }
    }
}

interface DeviceResponse {
    devices: Device[]
}
