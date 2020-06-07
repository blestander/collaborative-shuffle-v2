import { SimplifiedArtist } from './artist';
import { Image } from './image';

export interface SimplifiedAlbum {
    album_group?: string;
    album_type: string;
    artists: SimplifiedArtist[];
    available_markets: string[];
    // TODO External URLS
    href: string,
    id: string,
    images: Image[],
    name: string,
    release_date: string,
    release_date_precision: string,
    // TODO Restrictions
    type: string,
    uri: string,
}
