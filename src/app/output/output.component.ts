import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlaylistTrackObject } from '../playlist';

@Component({
    selector: 'app-output',
    templateUrl: './output.component.html',
    styleUrls: ['./output.component.css']
})
export class OutputComponent implements OnInit {

    @Input() songs: PlaylistTrackObject[];
    @Input() total: number;
    @Output() menuRequested = new EventEmitter<void>();

    constructor() { }

    ngOnInit(): void {
    }

    getTitle(song: PlaylistTrackObject): string {
        return song.track.name;
    }

    getArtists(song: PlaylistTrackObject): string[] {
        return song.track.artists.map(artist => artist.name);
    }

    getUsername(song: PlaylistTrackObject): string {
        let user = song.added_by;
        if (user)
            if (user.display_name)
                return user.display_name;
        return "";
    }

    getImageSrc(song: PlaylistTrackObject): string {
        return song.track.album.images[1].url;
    }

    onGoBack() {
        this.menuRequested.emit();
    }
}
