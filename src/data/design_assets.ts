
        
/**
 * Model untuk aset gambar atau latar belakang utama.
 * Hanya berisi aset statis global.
 */
export interface DesignAssetModel {
  name: string;
  url: string;
  description: string;
}

export const LOGIN_BACKGROUND_IMAGE: DesignAssetModel = {
  name: "Latar Belakang Login",
  url: "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/12/3/d2541389-9ed1-4d6a-b476-f342b4d1be71.png",
  description: "Latar belakang gradien elegan hijau dan kuning keemasan untuk halaman login.",
};
        
      