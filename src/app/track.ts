import { SimplifiedArtist } from './artist';

export interface Track {
    // TODO Album
    artists: SimplifiedArtist[],
    available_markets: string[],
    disc_number: number,
    duration_ms: number,
    explicit: boolean,
    // TODO External IDS
    // TODO External URLS
    href: string,
    id: string,
    is_playable?: boolean,
    // TODO Linked from
    // TODO Restrictions
    name: string,
    popularity: number,
    preview_url?: string,
    track_number: number,
    type: string,
    uri: string,
}
