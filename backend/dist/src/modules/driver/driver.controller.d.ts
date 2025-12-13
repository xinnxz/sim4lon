import { DriverService } from './driver.service';
import { CreateDriverDto, UpdateDriverDto } from './dto';
export declare class DriverController {
    private readonly driverService;
    constructor(driverService: DriverService);
    findAll(page?: string, limit?: string, isActive?: string): Promise<{
        data: ({
            _count: {
                orders: number;
            };
        } & {
            id: string;
            name: string;
            is_active: boolean;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            code: string;
            phone: string | null;
            vehicle_id: string | null;
            note: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        _count: {
            orders: number;
        };
    } & {
        id: string;
        name: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        code: string;
        phone: string | null;
        vehicle_id: string | null;
        note: string | null;
    }>;
    create(dto: CreateDriverDto): Promise<{
        id: string;
        name: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        code: string;
        phone: string | null;
        vehicle_id: string | null;
        note: string | null;
    }>;
    update(id: string, dto: UpdateDriverDto): Promise<{
        id: string;
        name: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        code: string;
        phone: string | null;
        vehicle_id: string | null;
        note: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
