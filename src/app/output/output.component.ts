import { Component, OnInit, Input } from '@angular/core';
import { PlaylistTrackObject } from '../playlist';

@Component({
    selector: 'app-output',
    templateUrl: './output.component.html',
    styleUrls: ['./output.component.css']
})
export class OutputComponent implements OnInit {

    @Input() songs: PlaylistTrackObject[];

    constructor() { }

    ngOnInit(): void {
    }

    getTitle(song: PlaylistTrackObject): string {
        return song.track.name;
    }

    getArtists(song: PlaylistTrackObject): string[] {
        return ["Some Artist"];
    }

    getUsername(song: PlaylistTrackObject): string {
        return "Some user";
    }

    getImageSrc(song: PlaylistTrackObject): string {
        return "https://dummyimage.com/300x300/000000/aaaaaa.png";
    }

}
