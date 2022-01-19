import { Injectable } from '@angular/core';
import { Observable, of, empty } from 'rxjs';
import { pluck, expand, mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Device } from './device';
import { SimplifiedPlaylist, PlaylistTrackObject } from './playlist';
import { environment } from 'src/environments/environment';

const fragmentRegex = /access_token=(.*)&/

@Injectable({
    providedIn: 'root'
})
export class SpotifyService {

    constructor(
        private http: HttpClient
    ) { }

    authorizeIndirectGrant(redirect_uri: string, scope: string[] = []): void {
        let encodedScope = encodeURI(scope.join(" "));
        const clientID = environment.clientID;
        let url = `https://accounts.spotify.com/authorize?response_type=token&redirect_uri=${redirect_uri}&client_id=${clientID}&scope=${encodedScope}`;
        location.assign(url);
    }

    get loggedIn(): Observable<boolean> {
        return of(this.accessToken.length > 0);
    }

    get devices(): Observable<Device[]> {
        return this.http.get<DeviceResponse>("https://api.spotify.com/v1/me/player/devices", {headers: this.authHeader})
            .pipe(pluck('devices')); // Turns Observable<DeviceResponse> into Observable<Device
    }

    get userPlaylists(): Observable<SimplifiedPlaylist> {
        return this.http.get<PagingObject<SimplifiedPlaylist>>(
            "https://api.spotify.com/v1/me/playlists",
            {headers: this.authHeader}
        ) // First page of paging objects
            .pipe(expand(po => {
                if (po.next)
                    return this.http.get<PagingObject<SimplifiedPlaylist>>(
                        po.next,
                        {headers: this.authHeader}
                    );
                else
                    return empty();
            })) // All paging objects
            .pipe(pluck('items')) // Observable<SimplifiedPlaylist[]>
            .pipe(mergeMap(array => array)); // Observable<SimplifiedPlaylist>
    }

    getPlaylistSongs(playlist_id: string): Observable<any> {
        return this.http.get<PagingObject<PlaylistTrackObject>>(
            `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
            { headers: this.authHeader }
        ) // First page of paging objects
            .pipe(expand(po => {
                if (po.next)
                    return this.http.get<PagingObject<PlaylistTrackObject>>(
                        po.next,
                        { headers: this.authHeader }
                    );
                else
                    return empty();
            })) // All paging objects
            .pipe(pluck('items')) // Observable<PlaylistTrackObject[]>
            .pipe(mergeMap(array => array)); // Observable<PlaylistTrackObject>
    }

    addItemToQueue(item_uri: string, device_id: string = undefined): Observable<void> {
        return this.http.post<void>(
            `https://api.spotify.com/v1/me/player/queue?uri=${item_uri}&device_id=${device_id}`,
            {},
            { headers: this.authHeader }
        );
    }

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

interface PagingObject<T> {
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
