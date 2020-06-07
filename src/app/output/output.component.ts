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

}
