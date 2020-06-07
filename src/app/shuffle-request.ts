import { SimplifiedPlaylist } from './playlist';
import { Device } from './device';

export interface ShuffleRequest {
    playlist: SimplifiedPlaylist,
    device: Device,
    algorithm: string
};
