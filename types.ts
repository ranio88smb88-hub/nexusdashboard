
export enum MenuType {
  LOGIN_PRIBADI = 'LOGIN_PRIBADI',
  IZIN_KELUAR = 'IZIN_KELUAR',
  DAFTAR_STAFF = 'DAFTAR_STAFF',
  JADWAL_PASARAN = 'JADWAL_PASARAN',
  REKAPAN_TUGAS = 'REKAPAN_TUGAS',
  BUANG_DANA = 'BUANG_DANA',
  PREDIKSI_BOLA = 'PREDIKSI_BOLA',
  PREDIKSI_TOGEL = 'PREDIKSI_TOGEL',
  SYAIR = 'SYAIR',
  CALC_TOGEL = 'CALC_TOGEL',
  CALC_BOLA = 'CALC_BOLA',
  REKAPAN_REPORTAN = 'REKAPAN_REPORTAN'
}

export interface UserSession {
  username: string;
  isLoggedIn: boolean;
}

export interface TableColumn {
  key: string;
  label: string;
}

export interface TableData {
  [key: string]: any;
}
