import { SimplifiedPlaylist } from './playlist';

export interface ShuffleRequest {
    playlist: SimplifiedPlaylist,
    algorithm: string
};
