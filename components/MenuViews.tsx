
import React, { useState } from 'react';
import { MenuType } from '../types';
import { PASARAN_DATA, TUGAS_DATA, PREDIKSI_BOLA, REPORTAN_DATA, SYAIR_DATA, STAFF_DATA, IZIN_DATA } from '../data/dummy';

interface ViewProps {
  type: MenuType;
}

const GlassTable: React.FC<{ columns: any[], data: any[] }> = ({ columns, data }) => (
  <div className="overflow-x-auto glass rounded-xl border border-white/10 mt-6 animate-hero">
    <table className="w-full text-left border-collapse">
      <thead className="bg-white/5 border-b border-white/10 sticky top-0 backdrop-blur-md">
        <tr>
          {columns.map(col => (
            <th key={col.key} className="p-4 font-heading text-[10px] uppercase tracking-widest text-white/50">{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
            {columns.map(col => (
              <td key={col.key} className="p-4 text-[11px] group-hover:text-white transition-colors">
                {col.key === 'status' ? (
                  <span className={`px-2 py-1 rounded text-[9px] uppercase tracking-tighter ${
                    row[col.key] === 'Approved' || row[col.key] === 'Done' || row[col.key] === 'Active' 
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                    : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  }`}>
                    {row[col.key]}
                  </span>
                ) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ScriptPanel: React.FC<{ title: string, code: string }> = ({ title, code }) => (
  <div className="space-y-4 animate-hero">
    <h3 className="text-xl font-heading mb-4">{title}</h3>
    <div className="glass p-6 rounded-xl border border-white/10">
      <pre className="text-xs text-blue-300 font-mono whitespace-pre-wrap">{code}</pre>
    </div>
    <button className="px-6 py-2 glass rounded-lg border border-white/10 hover:border-white/30 text-xs transition-all uppercase tracking-widest">Copy to Clipboard</button>
  </div>
);

const TogelCalc: React.FC = () => {
  const [bet, setBet] = useState('');
  const [result, setResult] = useState<number | null>(null);
  return (
    <div className="glass p-8 rounded-xl max-w-md border border-white/10 animate-hero">
      <h3 className="text-xl font-heading mb-6">Calculator Togel Matrix</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] uppercase text-white/40 mb-1 tracking-widest">Nominal Bet (IDR)</label>
          <input 
            type="number" 
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-white/30 text-white"
            value={bet}
            onChange={(e) => setBet(e.target.value)}
            placeholder="1000"
          />
        </div>
        <button 
          onClick={() => setResult(Number(bet) * 3000)}
          className="w-full py-3 bg-white text-black text-xs font-heading uppercase tracking-widest hover:bg-white/90 transition-all"
        >
          Calculate Potential (x3000)
        </button>
        {result !== null && (
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-[10px] uppercase text-white/40 mb-1">Estimated Return</p>
            <p className="text-2xl font-heading text-green-400">Rp {result.toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const MenuViews: React.FC<ViewProps> = ({ type }) => {
  switch (type) {
    case MenuType.LOGIN_PRIBADI:
      return (
        <div className="glass p-8 rounded-xl border border-white/10 max-w-lg animate-hero">
          <h2 className="text-2xl font-heading mb-6">System Identity</h2>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-white/40 text-[10px] uppercase tracking-widest">Operator ID</span>
              <span className="text-sm">Nexus_Admin_712</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-white/40 text-[10px] uppercase tracking-widest">Access Level</span>
              <span className="text-sm text-blue-400">ROOT_AUTHORITY</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-white/40 text-[10px] uppercase tracking-widest">Last Auth</span>
              <span className="text-sm">{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    case MenuType.DAFTAR_STAFF:
      return <GlassTable 
        columns={[
          { key: 'id', label: 'Staff ID' },
          { key: 'nama', label: 'Nama Lengkap' },
          { key: 'jabatan', label: 'Jabatan' },
          { key: 'status', label: 'Status' }
        ]} 
        data={STAFF_DATA} 
      />;
    case MenuType.IZIN_KELUAR:
      return <GlassTable 
        columns={[
          { key: 'id', label: 'Permit ID' },
          { key: 'nama', label: 'Staff' },
          { key: 'keluar', label: 'Jam Keluar' },
          { key: 'kembali', label: 'Jam Kembali' },
          { key: 'keperluan', label: 'Keperluan' },
          { key: 'status', label: 'Status' }
        ]} 
        data={IZIN_DATA} 
      />;
    case MenuType.JADWAL_PASARAN:
      return <GlassTable 
        columns={[
          { key: 'pasaran', label: 'Pasaran' },
          { key: 'tutup', label: 'Tutup' },
          { key: 'result', label: 'Result' },
          { key: 'hari', label: 'Hari Aktif' }
        ]} 
        data={PASARAN_DATA} 
      />;
    case MenuType.REKAPAN_TUGAS:
      return <GlassTable 
        columns={[
          { key: 'tugas', label: 'Nama Tugas' },
          { key: 'deadline', label: 'Deadline' },
          { key: 'prioritas', label: 'Priority' },
          { key: 'status', label: 'Status' }
        ]} 
        data={TUGAS_DATA} 
      />;
    case MenuType.BUANG_DANA:
      return <ScriptPanel 
        title="SC Buang Dana v2.0" 
        code={`// Nexus Engine - Buang Dana Optimization\nconst init = () => {\n  const pool = fetch('https://api.nexus/v1/pool');\n  return pool.map(item => ({\n    id: item.id,\n    amount: item.amount * 0.95,\n    status: 'OPTIMIZED'\n  }));\n};`} 
      />;
    case MenuType.PREDIKSI_BOLA:
      return <GlassTable 
        columns={[
          { key: 'match', label: 'Pertandingan' },
          { key: 'prediksi', label: 'Tips' },
          { key: 'odd', label: 'Odd' },
          { key: 'confidence', label: 'Conf.' }
        ]} 
        data={PREDIKSI_BOLA} 
      />;
    case MenuType.REKAPAN_REPORTAN:
      return <GlassTable 
        columns={[
          { key: 'id', label: 'RPT ID' },
          { key: 'tanggal', label: 'Tanggal' },
          { key: 'kategori', label: 'Kategori' },
          { key: 'total', label: 'Total' }
        ]} 
        data={REPORTAN_DATA} 
      />;
    case MenuType.SYAIR:
      return <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-hero">
        {SYAIR_DATA.map((s, i) => (
          <div key={i} className="glass p-6 rounded-xl border border-white/10 hover:border-white/30 transition-all cursor-pointer">
            <h4 className="font-heading text-lg mb-2">{s.judul}</h4>
            <p className="text-[10px] text-white/40 mb-4">{s.tanggal}</p>
            <p className="text-sm italic leading-relaxed text-white/80">"{s.isi}"</p>
          </div>
        ))}
      </div>;
    case MenuType.CALC_TOGEL:
      return <TogelCalc />;
    default:
      return <div className="glass p-12 rounded-xl text-center text-white/30">Module for {type} is currently being initialized...</div>;
  }
};
