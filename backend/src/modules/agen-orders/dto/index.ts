import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

/**
 * DTO for creating a new order to agen
 */
export class CreateAgenOrderDto {
    @IsString()
    lpg_type: string;

    @IsNumber()
    @Min(1)
    qty: number;

    @IsOptional()
    @IsString()
    note?: string;
}

/**
 * DTO for receiving order from agen
 */
export class ReceiveAgenOrderDto {
    @IsNumber()
    @Min(1)
    qty_received: number;

    @IsOptional()
    @IsString()
    note?: string;
}

export { CreateAgenOrderDto as CreateDto, ReceiveAgenOrderDto as ReceiveDto };
