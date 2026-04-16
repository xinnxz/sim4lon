export declare class CreateAgenOrderDto {
    lpg_type: string;
    qty: number;
    note?: string;
}
export declare class ReceiveAgenOrderDto {
    qty_received: number;
    note?: string;
}
export { CreateAgenOrderDto as CreateDto, ReceiveAgenOrderDto as ReceiveDto };
