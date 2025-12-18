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
            name: string;
            id: string;
            code: string;
            phone: string | null;
            is_active: boolean;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            note: string | null;
            vehicle_id: string | null;
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
        name: string;
        id: string;
        code: string;
        phone: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        note: string | null;
        vehicle_id: string | null;
    }>;
    create(dto: CreateDriverDto): Promise<{
        name: string;
        id: string;
        code: string;
        phone: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        note: string | null;
        vehicle_id: string | null;
    }>;
    update(id: string, dto: UpdateDriverDto): Promise<{
        name: string;
        id: string;
        code: string;
        phone: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        note: string | null;
        vehicle_id: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
