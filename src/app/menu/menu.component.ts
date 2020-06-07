import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SpotifyService } from '../spotify.service';
import { Device } from '../device';
import { SimplifiedPlaylist } from '../playlist';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

    form: FormGroup = this.fb.group({
        playlist: ['', Validators.required],
        device: ['', Validators.required],
        algorithm: ['true-shuffle', Validators.required]
    });

    playlists: SimplifiedPlaylist[] = [];
    devices: Device[] = [];

    constructor(
        private fb: FormBuilder,
        private spotify: SpotifyService
    ) { }

    ngOnInit(): void {
        this.spotify.devices.subscribe(ds => this.devices = ds);
        this.spotify.userPlaylists.subscribe(playlist => this.playlists.push(playlist));
    }

    playlistDisplay(playlist: SimplifiedPlaylist) {
        return `${playlist.name}`;
    }

    deviceDisplay(device: Device) {
        let activeState = device.is_active ? "<ACTIVE>" : "<inactive>";
        return `${device.name} ${activeState}`;
    }
}
