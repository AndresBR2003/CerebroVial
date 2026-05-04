export interface Alert {
    id: number | string;
    type: string;
    msg: string;
    time: string;
    details?: string;
}
