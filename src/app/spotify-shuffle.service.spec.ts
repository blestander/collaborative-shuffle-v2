import { TestBed } from '@angular/core/testing';

import { SpotifyShuffleService } from './spotify-shuffle.service';

describe('SpotifyShuffleService', () => {
    let service: SpotifyShuffleService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SpotifyShuffleService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
