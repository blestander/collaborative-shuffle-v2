import { Component, OnInit, Input } from '@angular/core';
import { PlaylistTrackObject } from '../playlist';

@Component({
    selector: 'app-song-display',
    templateUrl: './song-display.component.html',
    styleUrls: ['./song-display.component.css']
})
export class SongDisplayComponent implements OnInit {

    @Input() item: PlaylistTrackObject;

    constructor() { }

    ngOnInit(): void {
    }

}
