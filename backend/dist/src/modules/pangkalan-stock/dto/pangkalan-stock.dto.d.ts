export type LpgType = 'kg3' | 'kg5' | 'kg12' | 'kg50';
export type MovementType = 'MASUK' | 'KELUAR' | 'OPNAME';
export declare const LPG_TYPES: LpgType[];
export declare const LPG_TYPES_FRONTEND: string[];
export declare const ALL_LPG_TYPES: string[];
export declare const MOVEMENT_TYPES: MovementType[];
export declare function toBackendFormat(type: string): LpgType;
export declare function toFrontendFormat(type: string): string;
export declare class ReceiveStockDto {
    lpg_type: LpgType;
    qty: number;
    note?: string;
    movement_date?: string;
}
export declare class AdjustStockDto {
    lpg_type: LpgType;
    actual_qty: number;
    note?: string;
}
export declare class UpdateStockLevelsDto {
    lpg_type: LpgType;
    warning_level?: number;
    critical_level?: number;
}
