import { Image } from './image';
import { Track } from './track';
import { PublicUser } from './user';

export interface SimplifiedPlaylist {
    collaborative: boolean,
    description?: string,
    href: string,
    id: string,
    images: Image[],
    name: string,
    snapshot_id: string,
    uri: string,
    tracks?: TracksObject
}

export interface TracksObject {
    href: string,
    total: number,
}

export interface PlaylistTrackObject {
    added_at: string;
    added_by: PublicUser;
    is_local: boolean;
    track: Track;
}
