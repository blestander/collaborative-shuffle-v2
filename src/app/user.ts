import { Image } from './image';

export interface PublicUser {
    display_name?: string;
    // TODO External URLS
    // TODO Followers
    href: string;
    id: string;
    images: Image[];
    type: string;
    uri: string;
}
