
// Data Mockup
const staffList = [
    { id: 'ST-001', nama: 'Budi Santoso', jabatan: 'IT Support', status: 'Active' },
    { id: 'ST-002', nama: 'Siti Aminah', jabatan: 'HR Manager', status: 'Active' },
    { id: 'ST-003', nama: 'Andi Wijaya', jabatan: 'Developer', status: 'On Leave' },
    { id: 'ST-004', nama: 'Dewi Lestari', jabatan: 'Finance', status: 'Active' }
];

const exitPermits = [
    { id: 'PR-101', nama: 'Budi Santoso', jamKeluar: '09:00', jamKembali: '10:30', keperluan: 'Urus Bank', status: 'Approved' },
    { id: 'PR-102', nama: 'Dewi Lestari', jamKeluar: '11:00', jamKembali: '-', keperluan: 'Ambil Paket', status: 'Pending' }
];

const menuItems = [
    { id: 'profil', label: 'Data Login Pribadi', icon: '👤' },
    { id: 'izin-list', label: 'Daftar Izin Keluar', icon: '📅' },
    { id: 'staff-list', label: 'Data Daftar Staff', icon: '👥' },
    { id: 'tugas-rekap', label: 'Rekapan Tugas Staff', icon: '📝' },
    { id: 'izin-form', label: 'Form Izin Baru', icon: '➕' },
    { id: 'statistik', label: 'Statistik Izin Keluar', icon: '📊' },
    { id: 'kalkulator', label: 'Kalkulator Jam Kerja', icon: '🧮' },
    { id: 'prediksi', label: 'Prediksi Padat Keluar', icon: '🎲' },
    { id: 'syair', label: 'Pengumuman Harian', icon: '📜' },
    { id: 'reportan', label: 'Rekapan Reportan', icon: '📈' }
];

const renderSidebar = () => {
    const nav = document.getElementById('sidebar-nav');
    if(!nav) return;
    
    nav.innerHTML = menuItems.map(item => `
        <button class="nav-item" data-id="${item.id}" onclick="window.loadModule('${item.id}')">
            ${item.icon} ${item.label}
        </button>
    `).join('');
};

window.loadModule = (id) => {
    const container = document.getElementById('module-container');
    const title = document.getElementById('module-title');
    const menu = menuItems.find(m => m.id === id);
    
    title.innerText = `Module // ${menu.label}`;
    
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.toggle('active', el.dataset.id === id);
    });

    switch(id) {
        case 'profil':
            container.innerHTML = `
                <div class="glass p-10 rounded-2xl max-w-2xl animate-hero">
                    <h3 class="text-xl font-heading mb-6">Security Profile</h3>
                    <div class="space-y-4">
                        <div class="flex justify-between border-b border-white/5 pb-2">
                            <span class="text-white/40 uppercase">Operator</span>
                            <span>Admin_Nexus</span>
                        </div>
                        <div class="flex justify-between border-b border-white/5 pb-2">
                            <span class="text-white/40 uppercase">Access Level</span>
                            <span class="text-blue-400">ROOT_AUTHORITY</span>
                        </div>
                        <div class="flex justify-between border-b border-white/5 pb-2">
                            <span class="text-white/40 uppercase">Terminal ID</span>
                            <span>NXS-8821-X</span>
                        </div>
                    </div>
                </div>
            `;
            break;

        case 'izin-list':
            container.innerHTML = `
                <div class="nexus-table-container animate-hero">
                    <table class="nexus-table">
                        <thead>
                            <tr><th>Permit ID</th><th>Staff</th><th>Out</th><th>Return</th><th>Reason</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                            ${exitPermits.map(p => `
                                <tr>
                                    <td>${p.id}</td>
                                    <td>${p.nama}</td>
                                    <td>${p.jamKeluar}</td>
                                    <td>${p.jamKembali}</td>
                                    <td>${p.keperluan}</td>
                                    <td><span class="status-badge ${p.status === 'Approved' ? 'status-done' : 'status-pending'}">${p.status}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
            break;

        case 'staff-list':
            container.innerHTML = `
                <div class="nexus-table-container animate-hero">
                    <table class="nexus-table">
                        <thead>
                            <tr><th>Staff ID</th><th>Name</th><th>Position</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                            ${staffList.map(s => `
                                <tr>
                                    <td>${s.id}</td>
                                    <td>${s.nama}</td>
                                    <td>${s.jabatan}</td>
                                    <td><span class="text-xs uppercase opacity-60">${s.status}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
            break;

        case 'izin-form':
            container.innerHTML = `
                <div class="glass p-10 rounded-2xl max-w-lg animate-hero">
                    <h3 class="text-xl font-heading mb-8">New Exit Permit</h3>
                    <div class="space-y-6">
                        <div class="input-group">
                            <label>Staff Select</label>
                            <select class="w-full bg-transparent border-b border-white/10 py-2 text-white outline-none">
                                ${staffList.map(s => `<option value="${s.id}">${s.nama}</option>`).join('')}
                            </select>
                        </div>
                        <div class="input-group">
                            <label>Reason / Destination</label>
                            <input type="text" placeholder="Quantum Bank / Lunch" class="w-full bg-transparent border-b border-white/10 py-2 text-white outline-none">
                        </div>
                        <div class="flex gap-4">
                            <div class="flex-1 input-group">
                                <label>Estimated Out</label>
                                <input type="time" class="w-full bg-transparent border-b border-white/10 py-2 text-white outline-none">
                            </div>
                            <div class="flex-1 input-group">
                                <label>Estimated Back</label>
                                <input type="time" class="w-full bg-transparent border-b border-white/10 py-2 text-white outline-none">
                            </div>
                        </div>
                        <button class="submit-btn mt-4">Generate Permit</button>
                    </div>
                </div>
            `;
            break;

        case 'kalkulator':
            container.innerHTML = `
                <div class="glass p-10 rounded-2xl max-w-sm animate-hero">
                    <h3 class="text-xl font-heading mb-6">Work Hour Calc</h3>
                    <div class="space-y-4">
                        <div class="input-group">
                            <label>Hours Out</label>
                            <input type="number" id="h-out" value="2" class="w-full bg-transparent border-b border-white/10 py-2 text-white outline-none">
                        </div>
                        <button onclick="calcHours()" class="submit-btn">Calculate Deduction</button>
                        <div id="calc-res" class="mt-4 text-center text-lg font-heading text-blue-400"></div>
                    </div>
                </div>
            `;
            window.calcHours = () => {
                const h = document.getElementById('h-out').value;
                document.getElementById('calc-res').innerText = `Deduction: ${(h * 15000).toLocaleString()} IDR`;
            };
            break;

        default:
            container.innerHTML = `
                <div class="flex items-center justify-center h-full opacity-20">
                    <h2 class="text-4xl font-heading">Module Under Maintenance</h2>
                </div>
            `;
    }
};

renderSidebar();
window.loadModule('profil');
