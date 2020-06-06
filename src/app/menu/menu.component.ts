import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SpotifyService } from '../spotify.service';

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

    constructor(
        private fb: FormBuilder,
        private spotify: SpotifyService
    ) { }

    ngOnInit(): void {
        this.spotify.devices.subscribe(ds => {
            console.log(ds);
        });
    }
}
