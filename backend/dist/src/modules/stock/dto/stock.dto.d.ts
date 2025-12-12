export declare class CreateStockMovementDto {
    lpg_type?: string;
    lpg_product_id?: string;
    movement_type: string;
    qty: number;
    note?: string;
}
export declare function mapLpgTypeToEnum(value: string): 'kg3' | 'kg12' | 'kg50';
export declare function mapMovementTypeToEnum(value: string): 'MASUK' | 'KELUAR';
