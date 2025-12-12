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
            is_active: boolean;
            name: string;
            phone: string | null;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
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
        is_active: boolean;
        name: string;
        phone: string | null;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        vehicle_id: string | null;
        note: string | null;
    }>;
    create(dto: CreateDriverDto): Promise<{
        id: string;
        is_active: boolean;
        name: string;
        phone: string | null;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        vehicle_id: string | null;
        note: string | null;
    }>;
    update(id: string, dto: UpdateDriverDto): Promise<{
        id: string;
        is_active: boolean;
        name: string;
        phone: string | null;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        vehicle_id: string | null;
        note: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
