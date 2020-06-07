import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, pluck, exhaust } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Device } from './device';

const fragmentRegex = /access_token=(.*)&/

@Injectable({
    providedIn: 'root'
})
export class SpotifyService {

    constructor(
        private http: HttpClient
    ) { }

    authorizeIndirectGrant(redirect_uri: string, client_id: string, scope: string[] = []): void {
        let encodedScope = encodeURI(scope.join(" "));
        let url = `https://accounts.spotify.com/authorize?response_type=token&redirect_uri=${redirect_uri}&client_id=${client_id}&scope=${encodedScope}`;
        location.assign(url);
    }

    get loggedIn(): Observable<boolean> {
        return of(this.accessToken.length > 0);
    }

    get devices(): Observable<Device[]> {
        return this.http.get<DeviceResponse>(
            "https://api.spotify.com/v1/me/player/devices",
            {
                headers: this.authHeader
            }
        ) // Returns Observable<DeviceResponse>
            .pipe(pluck('devices')); // Returns Observable<Device[]>
    }

    // get userPlaylists(): Observable<Playlist> {
    // }

    private get accessToken(): string {
        let fragment = location.hash.substr(1);
        let result = fragmentRegex.exec(fragment);
        if (result)
            return result[1];
        else
            return "";
    }

    private get authHeader() {
        return {
            'Authorization': `Bearer ${this.accessToken}`
        }
    }
}

interface PagingOption<T> {
    href: string,
    items: T[],
    limit: number,
    offset: number,
    total: number,
    next?: string,
    previous?: string,
}

interface DeviceResponse {
    devices: Device[]
}
