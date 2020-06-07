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

    get title(): string {
        return this.item.track.name;
    }

    get artist(): string {
        return "Some Artist(s)"
    }

    get username(): string {
        return "Some User"
    }

    get imageHref(): string {
        return "https://dummyimage.com/300x300/000000/aaaaaa.png";
    }

}
