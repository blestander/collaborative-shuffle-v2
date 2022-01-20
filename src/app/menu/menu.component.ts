import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SpotifyService } from '../spotify.service';
import { Device } from '../device';
import { SimplifiedPlaylist } from '../playlist';
import { ShuffleRequest } from '../shuffle-request';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

    @Output() shuffleRequested = new EventEmitter<ShuffleRequest>();

    form: FormGroup = this.fb.group({
        playlist: ['', Validators.required],
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

    onSubmit(): void {
        let formOutput = this.form.value;
        let request: ShuffleRequest = {
            playlist: this.playlists[formOutput.playlist],
            algorithm: formOutput.algorithm
        };
        this.shuffleRequested.emit(request);
    }
}
