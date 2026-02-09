
import React, { useState, useEffect } from 'react';
import { MenuType, UserSession } from './types';
import Background from './components/Background';
import { MenuViews } from './components/MenuViews';

const App: React.FC = () => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [activeMenu, setActiveMenu] = useState<MenuType>(MenuType.LOGIN_PRIBADI);
  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const user = formData.get('username') as string;
    const pass = formData.get('password') as string;

    // Updated Credentials
    if (user === 'admin' && pass === 'admin123') {
      const newSession = { username: user, isLoggedIn: true };
      setSession(newSession);
      localStorage.setItem('nexus_session', JSON.stringify(newSession));
    } else {
      alert('ACCESS DENIED: Try admin / admin123');
    }
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem('nexus_session');
    setShowLogin(false);
  };

  useEffect(() => {
    const saved = localStorage.getItem('nexus_session');
    if (saved) setSession(JSON.parse(saved));
  }, []);

  if (!session) {
    return (
      <main className="relative min-h-screen w-full flex flex-col justify-between p-8 md:p-16 overflow-hidden bg-black text-white">
        <Background />
        
        <div className="relative z-10 flex justify-between items-start animate-hero">
          <div className="logo-container">
            <div className="w-10 h-6 border border-white/20 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="text-center">
             <h1 className="text-xl font-heading tracking-widest text-white/90">NEXUS.</h1>
          </div>
          <div>
            <p className="text-[8px] uppercase tracking-[0.4em] text-white/20">Operational Status // Active</p>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto animate-hero">
          {!showLogin ? (
            <>
              <h2 className="text-hero font-heading mb-12 text-white/90">
                Staff & Personal<br/>Management Interface
              </h2>
              <div className="space-y-4 max-w-sm">
                <p className="text-[9px] uppercase tracking-[0.4em] text-white/30 leading-loose">
                  Quantum terminal ready for identification<br/>
                  Awaiting administrator authorization protocols
                </p>
                <button 
                  onClick={() => setShowLogin(true)}
                  className="mt-12 px-12 py-4 bg-white text-black font-heading text-[10px] uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                >
                  Enter Vessel
                </button>
              </div>
            </>
          ) : (
            <div className="w-full max-w-xs space-y-8 mt-12 bg-black/40 p-8 rounded-2xl backdrop-blur-xl border border-white/5 shadow-2xl">
               <h3 className="text-xl font-heading text-white tracking-widest">AUTH_GATE</h3>
               <form onSubmit={handleLogin} className="space-y-6 text-left">
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase tracking-widest text-white/30">Personnel ID</label>
                    <input name="username" type="text" className="w-full bg-transparent border-b border-white/10 py-2 text-sm focus:outline-none focus:border-white/50 transition-all text-white font-secondary" placeholder="admin" autoComplete="off"/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase tracking-widest text-white/30">Access Key</label>
                    <input name="password" type="password" className="w-full bg-transparent border-b border-white/10 py-2 text-sm focus:outline-none focus:border-white/50 transition-all text-white" placeholder="••••••••"/>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button type="submit" className="flex-1 py-3 bg-white text-black text-[9px] font-heading uppercase tracking-widest rounded-sm hover:bg-white/90 transition-all">Confirm</button>
                    <button type="button" onClick={() => setShowLogin(false)} className="flex-1 py-3 border border-white/10 text-white text-[9px] uppercase tracking-widest hover:bg-white/5 transition-all">Cancel</button>
                  </div>
               </form>
            </div>
          )}
        </div>

        <div className="relative z-10 flex justify-between items-end animate-hero">
          <div className="flex flex-col gap-1 text-[9px] uppercase tracking-widest text-white/30">
            <span className="hover:text-white cursor-pointer transition-colors">Internal Logs</span>
            <span className="hover:text-white cursor-pointer transition-colors">Vessel State</span>
            <span className="hover:text-white cursor-pointer transition-colors">Contact Dev</span>
          </div>
          <div className="text-right">
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/40">Nexus 7.12 // Terminal v.2.4</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex text-white overflow-hidden font-secondary relative bg-black">
      <Background />
      
      <aside className="relative z-20 w-72 glass border-r border-white/5 flex flex-col p-10 backdrop-blur-2xl">
        <div className="mb-14">
           <h1 className="text-xl font-heading tracking-widest text-white/90">NEXUS.</h1>
           <p className="text-[8px] uppercase tracking-widest text-white/20 mt-1">Authorized Operator</p>
        </div>
        
        <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar pr-4">
          {(Object.values(MenuType)).map((type) => (
            <button
              key={type}
              onClick={() => setActiveMenu(type)}
              className={`block w-full text-left text-[9px] uppercase tracking-widest py-2 px-3 rounded-md transition-all ${
                activeMenu === type 
                ? 'text-white bg-white/5 border-l-2 border-white' 
                : 'text-white/30 hover:text-white hover:bg-white/2'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </nav>
        
        <div className="pt-8 border-t border-white/5 mt-6">
           <button onClick={handleLogout} className="text-[9px] uppercase tracking-widest text-red-400/50 hover:text-red-400 transition-colors">Disconnect Session</button>
        </div>
      </aside>

      <main className="flex-1 relative z-10 flex flex-col overflow-hidden bg-black/20">
        <header className="h-20 flex items-center justify-between px-12 border-b border-white/5 bg-black/10 backdrop-blur-md">
           <h2 className="text-[9px] uppercase tracking-[0.5em] text-white/40">Module // {activeMenu.replace('_', ' ')}</h2>
           <div className="text-[10px] font-mono opacity-30">{new Date().toLocaleTimeString()}</div>
        </header>
        
        <section className="flex-1 p-12 overflow-y-auto custom-scrollbar">
           <div className="max-w-5xl">
              <MenuViews type={activeMenu} />
           </div>
        </section>
      </main>
    </div>
  );
};

export default App;
