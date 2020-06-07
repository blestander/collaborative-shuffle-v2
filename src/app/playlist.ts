import { Image } from './image';

export interface SimplifiedPlaylist {
    collaborative: boolean,
    description?: string,
    href: string,
    id: string,
    images: Image[],
    name: string,
    snapshot_id: string,
    uri: string,
    // TODO Tracks
}
