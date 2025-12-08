
        
import { UserRole } from "./enums";

/**
 * Model lengkap detail pengguna.
 */
export interface UserModel {
  userId: string;
  nama: string;
  telepon: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  isActive: boolean;
}

/**
 * Model ringkas untuk item daftar pengguna.
 * Catatan: Aktif/Nonaktif status kini ada di model list khusus, atau bisa di-infer dari role/status lain.
 */
export interface UserListItemModel extends Omit<UserModel, 'email' | 'isActive'> {
  aksiIcon: string;
}

/**
 * Model ringkas untuk driver yang digunakan dalam jadwal/pengiriman.
 */
export interface DriverSummaryModel extends Pick<UserModel, 'userId' | 'nama' | 'telepon' | 'avatarUrl'> {}

/**
 * Model untuk item daftar Driver dalam halaman manajemen Driver (Daftar Supir).
 */
export interface DriverManagementItemModel extends DriverSummaryModel {
  isActive: boolean;
  aksiIcon: string;
}

/**
 * Model untuk data profil admin yang sedang login.
 */
export interface AdminProfileModel {
  userId: string;
  nama: string;
  email: string;
  role: UserRole;
  telepon: string;
  tanggalBergabung: string;
  avatarUrl: string;
}

export const MOCK_USERS_DATA: UserModel[] = [
  {
    userId: "U-001",
    nama: "Rian Hidayat (Admin)",
    telepon: "081122334455",
    email: "admin.rian@sim4lon.co.id",
    role: "ADMIN",
    avatarUrl: "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/12/3/8ef5ced8-689f-44f0-9bf0-8306799606b9.png",
    isActive: true,
  },
  {
    userId: "U-002",
    nama: "Siti Rahmawati (OP)",
    telepon: "082211445566",
    email: "siti.rahma@sim4lon.co.id",
    role: "OPERATOR",
    avatarUrl: "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/12/3/a863320f-b222-464e-9d78-6a123b045bf2.png",
    isActive: true,
  },
  {
    userId: "U-003",
    nama: "Bambang Sugiharto",
    telepon: "083399887766",
    email: "bambang.driver@sim4lon.co.id",
    role: "DRIVER",
    avatarUrl: "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/12/3/d3e81287-77ff-4dc6-830c-0e4e53fcee67.png",
    isActive: true,
  },
  {
    userId: "U-004",
    nama: "Asep Santoso",
    telepon: "087712345678",
    email: "asep.super@sim4lon.co.id",
    role: "SUPERVISOR",
    avatarUrl: "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/12/3/f01ae5bf-3071-4671-9554-a0df0f84bb32.png",
    isActive: true,
  },
  {
    userId: "U-005",
    nama: "Dedi Iskandar",
    telepon: "089812312312",
    email: "dedi.driver@sim4lon.co.id",
    role: "DRIVER",
    avatarUrl: "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/12/4/d4827dfa-9699-4dd4-961e-d99b46bdba7f.png",
    isActive: false, // Nonaktif
  }
];

// Data Mock Profil Admin (Rian Hidayat)
export const MOCK_ADMIN_PROFILE: AdminProfileModel = {
  userId: "U-001",
  nama: "Rian Hidayat (Admin)",
  email: "admin.rian@sim4lon.co.id",
  role: "ADMIN",
  telepon: "0811-2233-4455",
  tanggalBergabung: "2023-08-15",
  avatarUrl: MOCK_USERS_DATA[0].avatarUrl,
};

export const MOCK_DRIVER_LIST: DriverSummaryModel[] = MOCK_USERS_DATA
  .filter(u => u.role === 'DRIVER' && u.isActive)
  .map(u => ({
    userId: u.userId,
    nama: u.nama,
    telepon: u.telepon,
    avatarUrl: u.avatarUrl,
  }));

export const MOCK_USER_LIST_ITEM: UserListItemModel[] = MOCK_USERS_DATA.map(u => ({
  userId: u.userId,
  nama: u.nama,
  telepon: u.telepon,
  role: u.role,
  avatarUrl: u.avatarUrl,
  aksiIcon: "UserEdit",
}));

export const MOCK_DRIVER_MANAGEMENT_LIST: DriverManagementItemModel[] = MOCK_USERS_DATA
  .filter(u => u.role === 'DRIVER')
  .map(u => ({
    userId: u.userId,
    nama: u.nama,
    telepon: u.telepon,
    // Note: avatarUrl is included in DriverSummaryModel which this extends
    avatarUrl: u.avatarUrl,
    isActive: u.isActive,
    aksiIcon: "Edit",
  }));

export const getUserById = (id: string): UserModel | undefined => {
  return MOCK_USERS_DATA.find(u => u.userId === id);
}

export const getAdminProfile = (): AdminProfileModel => MOCK_ADMIN_PROFILE;

export const getDriverById = (id: string): DriverSummaryModel | undefined => {
  const user = MOCK_USERS_DATA.find(u => u.userId === id && u.role === 'DRIVER');
  if (!user) return undefined;
  return {
    userId: user.userId,
    nama: user.nama,
    telepon: user.telepon,
    avatarUrl: user.avatarUrl,
  };
};
        
      