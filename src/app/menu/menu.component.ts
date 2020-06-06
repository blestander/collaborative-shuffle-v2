import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
    }
}
