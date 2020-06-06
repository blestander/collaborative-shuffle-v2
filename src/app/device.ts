export interface Device {
    readonly id: string,
    readonly is_active: boolean,
    readonly is_private_session: boolean,
    readonly is_restricted: boolean,
    readonly name: string,
    readonly type: string,
    readonly volume?: number
}
