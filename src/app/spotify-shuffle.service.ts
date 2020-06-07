import { Injectable } from '@angular/core';
import { ShuffleRequest } from './shuffle-request';
import { Observable, of } from 'rxjs';
import { SpotifyService } from './spotify.service';
import { toArray, map, mergeMap} from 'rxjs/operators';
import { PlaylistTrackObject } from './playlist';

@Injectable({
    providedIn: 'root'
})
export class SpotifyShuffleService {

    constructor(private spotify: SpotifyService) { }

    shuffle(request: ShuffleRequest): Observable<any> {
        return this.spotify.getPlaylistSongs(request.playlist.id)
            .pipe(toArray())
            .pipe(map(songs => this.shuffleSongs(songs, request.algorithm)))
            .pipe(mergeMap(songs => songs))
            .pipe(mergeMap(song => {
                return this.spotify.addItemToQueue(song.track.uri, request.device.id).pipe(mergeMap(() => of(song)));
            }, 1));
    }

    private shuffleSongs(songs: PlaylistTrackObject[], method: string) {
        switch (method) {
            case "true-shuffle":
                return this.shuffleTrueShuffle(songs);
            case "perfect-mix":
                return this.shufflePerfectCollaboratorMix(songs);
            case "prob-mix":
                return this.shuffleProbabilisticCOllaboratorMix(songs);
            case "pass-through":
            default:
                return songs;
        }
    }

    private shuffleTrueShuffle(songs: PlaylistTrackObject[]) {
        for (let i = songs.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let swap = songs[i];
            songs[i] = songs[j];
            songs[j] = swap;
        }
        return songs;
    }

    private shufflePerfectCollaboratorMix(songs: PlaylistTrackObject[]) {
        let results: PlaylistTrackObject[] = [];

        // Make the buckets
        let buckets: Buckets = this.bucketSongs(songs);

        // While there are still buckets
        while (Object.keys(buckets).length > 0) {
            // Grab a song from each bucket
            let round = [];
            for (const user of Object.keys(buckets))
                round.push(buckets[user].pop());

            // Shuffle the round
            round = this.shuffleTrueShuffle(round);

            // Insert the shuffled round into results
            results.splice(results.length, 0, ...round);

            // Drop empty buckets
            for (const user of Object.keys(buckets))
                if (buckets[user].length == 0)
                    delete buckets[user];
        }

        return results;
    }

    private shuffleProbabilisticCOllaboratorMix(songs: PlaylistTrackObject[]) {
        let results: PlaylistTrackObject[] = [];

        // Make the buckets
        let buckets: Buckets = this.bucketSongs(songs);

        // Calculate the totals and set up lastSeen
        let max: NumberDictionary = {}
        let lastSeen: NumberDictionary = {};
        for (const user of Object.keys(buckets)) {
            max[user] = buckets[user].length;
            lastSeen[user] = 1;
        }

        // While there's still more than one bucket left
        while (Object.keys(buckets).length > 1) {
            // Calculate the odds of this song belonging to each user
            let probs: NumberDictionary = this.calculateProbabilities(buckets, lastSeen, max);

            // Determine user for this round
            let winner = this.chooseWinner(probs);

            // Add a song from the winner to the results
            results.push(buckets[winner].pop());

            // Increment every lastSeen but winner, and drop winner to 1
            for (const user of Object.keys(buckets))
                if (user == winner)
                    // 1 if only two people, 0 otherwise
                    lastSeen[winner] = Object.keys(buckets).length == 2 ? 1 : 0;
                else
                    lastSeen[user]++;

            // Drop any empty buckets
            for (const user of Object.keys(buckets))
                if (buckets[user].length == 0)
                    delete buckets[user];
        }

        // If there's a bucket left...
        if (Object.keys(buckets).length > 0) {
            const user = Object.keys(buckets)[0];
            // Throw their remaining songs on the list
            results.splice(results.length, 0, ...buckets[user]);
        }

        return results;
    }

    // Partition the songs into buckets by submitting user
    private bucketSongs(songs: PlaylistTrackObject[]): Buckets {
        // Make buckets
        let buckets = {};
        for (const song of songs) {
            let user_id = song.added_by.id;
            if (buckets[user_id]) // Bucket exists
                buckets[user_id].push(song);
            else // Bucket needs to be made
                buckets[user_id] = [ song ];
        }

        // Shuffle buckets
        for (const id of Object.keys(buckets))
            buckets[id] = this.shuffleTrueShuffle(buckets[id]);
        return buckets;
    }

    // Probability is remaining * lastSeen / sum(everyone's values)
    private calculateProbabilities(
        buckets: Buckets,
        lastSeen: NumberDictionary,
        max: NumberDictionary
    ): NumberDictionary {
        let results: NumberDictionary = {};
        const users: string[] = Object.keys(buckets);

        // Determine probability values
        for (const user of users)
            results[user] = buckets[user].length * lastSeen[user];

        // Determine sum of probability values
        let sum = 0;
        for (const user of users)
            sum += results[user];

        // Divide by sum, to ensure all values sum to 1
        for (const user of users)
            results[user] /= sum;

        return results;
    }

    // Generate a random number and determine the winner based on that
    private chooseWinner(probabilites: NumberDictionary) {
        let lowerBound = 0;
        const users = Object.keys(probabilites);
        let i = 0;

        let randomNumber: number = Math.random();

        // For each user
        while (i < users.length) {
            // This round's user
            const user = users[i];

            // Determine upper bound
            const upperBound: number = lowerBound + probabilites[user];

            // If random number is in bounds...
            if (lowerBound <= randomNumber && randomNumber < upperBound)
                // We have our winner
                return user;

            // Next lower bound is current upper bound
            lowerBound = upperBound;

            // Increment index
            i++;
        }

        // In case there's some weird rounding error, and and last upper bound are high but below 1,...
        // and the random number is above it but below one, go with the last user.
        return users[users.length - 1];
    }
}

interface Buckets {
    [key: string]: PlaylistTrackObject[]
}

interface NumberDictionary {
    [key: string]: number,
}
