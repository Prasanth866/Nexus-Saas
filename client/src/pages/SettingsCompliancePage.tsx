import { useState } from 'react';
import { Bell, User, Search } from 'lucide-react';

interface Project {
  name: string;
  workspace: string;
  security: string;
}

interface SettingsCompliancePageProps {
  projects: Project[];
  activeProjectName: string;
  setActiveProjectName: (name: string) => void;
  onSelectPinned: (item: string) => void;
  onGoHome: () => void;
  onGoToMyTasks: () => void;
  onGoToAnalytics: () => void;
  onCreateTask: () => void;
  onSignOut: () => void;
}

export default function SettingsCompliancePage({
  projects,
  activeProjectName,
  setActiveProjectName,
  onSelectPinned,
  onGoHome,
  onGoToMyTasks,
  onGoToAnalytics,
  onCreateTask,
  onSignOut
}: SettingsCompliancePageProps) {
  const [subTab, setSubTab] = useState<'settings' | 'api-specs'>('settings');

  // Matrix checkboxes state
  const [matrix, setMatrix] = useState([
    { role: 'Manager', m: false, de: true, qa: false },
    { role: 'Developer', m: false, de: false, qa: false },
    { role: 'QA Compliance', m: false, de: false, qa: false }
  ]);

  const toggleMatrix = (rowIdx: number, colKey: 'm' | 'de' | 'qa') => {
    setMatrix(prev => prev.map((row, idx) => {
      if (idx === rowIdx) {
        return { ...row, [colKey]: !row[colKey] };
      }
      return row;
    }));
  };

  // Checkbox states for Open Corrective issue
  const [rcaChecklist, setRcaChecklist] = useState([false, false]);
  const [qmsChecklist, setQmsChecklist] = useState([false, false]);
  const [resChecklist, setResChecklist] = useState([false, false]);

  // User Profile & Avatar states
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('Developer Admin');
  const [emailAddress, setEmailAddress] = useState<string>('admin@nexus.io');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setAvatarUrl(url);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-12">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between px-8 py-4 border-b-2 border-black bg-white">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="bg-black text-white w-12 h-12 flex items-center justify-center font-extrabold text-2xl rounded-md relative shadow-sm">
            N
            <span className="absolute top-1 right-1 text-[10px] font-bold">7</span>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-widest leading-none">exus</span>
            <span className="text-[9px] font-bold tracking-widest lowercase mt-1">join together</span>
          </div>
        </div>

        {/* Navigation Links with Settings & Compliance highlighted */}
        <nav className="hidden md:flex items-center gap-8 font-extrabold text-sm">
          <a href="#" className="hover:underline text-gray-600 font-bold" onClick={onGoHome}>Home</a>
          <a href="#" className="hover:underline text-gray-600 font-bold" onClick={onGoToMyTasks}>My Tasks</a>
          <a href="#" className="hover:underline text-gray-600 font-bold" onClick={onGoToAnalytics}>Sprint Analytics</a>
          <span className="bg-black text-white px-4 py-1.5 rounded-full font-bold cursor-pointer border-2 border-black">
            Settings & Compliance
          </span>
        </nav>

        {/* Profile / Notifications */}
        <div className="flex items-center gap-4 relative">
          <button className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer">
            <Bell className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              title="Profile Settings"
              className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer overflow-hidden bg-white"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white border-4 border-black rounded-xl p-5 shadow-[-4px_4px_0px_0px_rgba(0,0,0,1)] z-50 space-y-4">
                <h3 className="font-extrabold text-sm border-b-2 border-black pb-2 flex items-center justify-between">
                  <span>Customise Avatar</span>
                  <button 
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="text-xs font-bold text-gray-500 hover:text-black hover:underline cursor-pointer"
                  >
                    Close
                  </button>
                </h3>

                <div className="flex flex-col items-center gap-4 py-2">
                  {/* Avatar Upload */}
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-black rounded-full overflow-hidden bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-12 h-12 text-gray-500" />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-white border-2 border-black rounded-full p-1.5 cursor-pointer hover:bg-black hover:text-white transition-colors shadow-sm flex items-center justify-center">
                      <span className="text-[10px] font-black px-1">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Profile info fields */}
                  <div className="w-full space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold mb-1 uppercase tracking-wide">Display Name</label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full border-2 border-black rounded-lg bg-white px-3 py-1.5 text-xs focus:outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold mb-1 uppercase tracking-wide">Email Address</label>
                      <input
                        type="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="john@nexus.io"
                        className="w-full border-2 border-black rounded-lg bg-white px-3 py-1.5 text-xs focus:outline-none font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t-2 border-black pt-3 flex flex-col gap-2">
                  <button
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="w-full bg-black text-white border-2 border-black rounded-lg py-1.5 font-bold text-xs hover:bg-white hover:text-black transition-colors cursor-pointer"
                  >
                    Save & Close
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onSignOut();
                    }}
                    className="w-full bg-red-100 text-red-700 border-2 border-red-700 rounded-lg py-1.5 font-bold text-xs hover:bg-red-700 hover:text-white transition-colors cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="max-w-7xl mx-auto mt-10 px-4">
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Left Sidebar */}
          <aside className="w-full md:w-64 bg-[#e5e5e5] border-2 border-black rounded-xl p-4 flex flex-col justify-between min-h-[500px]">
            <div className="space-y-4">
              {/* Dropdown project selector */}
              <div className="relative">
                <select
                  value={activeProjectName}
                  onChange={(e) => setActiveProjectName(e.target.value)}
                  className="w-full border-2 border-black rounded-lg px-3 py-2 bg-white font-extrabold text-sm cursor-pointer focus:outline-none"
                >
                  <option value="Nexus core">Nexus core</option>
                  {projects.map((proj, idx) => (
                    <option key={idx} value={proj.name}>{proj.name}</option>
                  ))}
                </select>
              </div>

              {/* + New Task Button */}
              <button
                type="button"
                onClick={onCreateTask}
                className="w-full bg-white text-black border-2 border-black rounded-lg px-3 py-2 font-extrabold text-sm hover:bg-black hover:text-white transition-all cursor-pointer"
              >
                + New Task
              </button>

              {/* Pinned Projects Box */}
              <div className="bg-white border-2 border-black rounded-xl p-4 space-y-3">
                <h3 className="font-extrabold text-sm uppercase tracking-wide border-b border-black/10 pb-1.5">Pinned</h3>
                <ul className="space-y-2 text-xs font-bold">
                  {projects.length === 0 ? (
                    <>
                      <li className="flex items-center gap-2 cursor-pointer hover:underline" onClick={() => onSelectPinned('Nexus-Front')}>
                        <span className="text-black">•</span> Nexus-Front
                      </li>
                      <li className="flex items-center gap-2 cursor-pointer hover:underline" onClick={() => onSelectPinned('Nexus-Back')}>
                        <span className="text-black">•</span> Nexus-Back
                      </li>
                      <li className="flex items-center gap-2 cursor-pointer hover:underline" onClick={() => onSelectPinned('Qms-Docs')}>
                        <span className="text-black">•</span> Qms-Docs
                      </li>
                    </>
                  ) : (
                    projects.map((proj, idx) => (
                      <li key={idx} className="flex items-center gap-2 cursor-pointer hover:underline" onClick={() => onSelectPinned(proj.name)}>
                        <span className="text-black">•</span> {proj.name}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>

            {/* Bottom profile avatar placeholder */}
            <div className="mt-8 pt-4 border-t border-black/10 flex justify-start">
              <div className="w-12 h-12 border-2 border-black rounded-full flex items-center justify-center bg-white shadow-sm overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6" />
                )}
              </div>
            </div>
          </aside>

          {/* Right Main Settings Area */}
          <section className="flex-1 space-y-6">
            
            {/* View Sub-Tabs */}
            <div className="flex border-b-2 border-black gap-2">
              <button
                onClick={() => setSubTab('settings')}
                className={`px-6 py-2 font-black text-sm border-t-2 border-x-2 border-black rounded-t-lg transition-all ${
                  subTab === 'settings' ? 'bg-[#e5e5e5] translate-y-[2px]' : 'bg-white hover:bg-gray-50'
                }`}
              >
                Settings and Compliance
              </button>
              <button
                onClick={() => setSubTab('api-specs')}
                className={`px-6 py-2 font-black text-sm border-t-2 border-x-2 border-black rounded-t-lg transition-all ${
                  subTab === 'api-specs' ? 'bg-[#e5e5e5] translate-y-[2px]' : 'bg-white hover:bg-gray-50'
                }`}
              >
                System API and Integration Specs
              </button>
            </div>

            {subTab === 'settings' ? (
              /* VIEW 1: Settings and Compliance */
              <div className="space-y-6">
                <h2 className="text-xl font-black">Settings and Compliance</h2>
                
                {/* Row 1 Grid: Workspace Profile & Access Control */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Workspace Profile */}
                  <div className="bg-[#e5e5e5] border-2 border-black rounded-xl p-5 space-y-4">
                    <h3 className="font-extrabold text-sm">Workspace Profile</h3>
                    <p className="text-[10px] font-bold text-gray-500">General Settings inputs</p>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold mb-1">Workspace Name</label>
                        <input
                          type="text"
                          placeholder="Workspace Name"
                          className="w-full border-2 border-black rounded-lg bg-white px-3 py-1.5 text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold mb-1">Domain</label>
                        <input
                          type="text"
                          placeholder="Domain"
                          className="w-full border-2 border-black rounded-lg bg-white px-3 py-1.5 text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Access Control and Members */}
                  <div className="bg-[#e5e5e5] border-2 border-black rounded-xl p-5 space-y-4">
                    <h3 className="font-extrabold text-sm">Access Control and Members</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* Roles Group */}
                      <div className="bg-white border-2 border-black rounded-xl p-3 space-y-2">
                        <h4 className="font-bold text-xs uppercase tracking-wide">Roles</h4>
                        <div className="border border-black/20 rounded p-2 text-[10px] font-bold text-gray-700 bg-gray-50">
                          <p className="border-b border-black/10 pb-1 mb-1">Roles group</p>
                          <p>Manager</p>
                          <p>Developer</p>
                          <p>QA Compliance</p>
                        </div>
                      </div>

                      {/* Permissions Matrix */}
                      <div className="bg-white border-2 border-black rounded-xl p-3 space-y-2">
                        <h4 className="font-bold text-xs uppercase tracking-wide">Permissions matrix</h4>
                        <table className="w-full text-center text-[10px] font-black border-collapse">
                          <thead>
                            <tr className="border-b border-black/10">
                              <th className="py-1">M</th>
                              <th className="py-1">DE</th>
                              <th className="py-1">QA</th>
                            </tr>
                          </thead>
                          <tbody>
                            {matrix.map((row, rowIdx) => (
                              <tr key={row.role} className="border-b border-black/5 last:border-b-0">
                                <td className="py-1.5">
                                  <input
                                    type="checkbox"
                                    checked={row.m}
                                    onChange={() => toggleMatrix(rowIdx, 'm')}
                                    className="w-3.5 h-3.5 border border-black rounded accent-black cursor-pointer"
                                  />
                                </td>
                                <td className="py-1.5">
                                  <input
                                    type="checkbox"
                                    checked={row.de}
                                    onChange={() => toggleMatrix(rowIdx, 'de')}
                                    className="w-3.5 h-3.5 border border-black rounded accent-black cursor-pointer"
                                  />
                                </td>
                                <td className="py-1.5">
                                  <input
                                    type="checkbox"
                                    checked={row.qa}
                                    onChange={() => toggleMatrix(rowIdx, 'qa')}
                                    className="w-3.5 h-3.5 border border-black rounded accent-black cursor-pointer"
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2 Grid: API token & System Audit Trail */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* API and Integration Management */}
                  <div className="bg-[#e5e5e5] border-2 border-black rounded-xl p-5 space-y-4">
                    <h3 className="font-extrabold text-sm">API and integration Management</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold mb-1">API token</label>
                        <select className="w-full border-2 border-black rounded-lg bg-white px-2 py-1.5 text-[10px] focus:outline-none cursor-pointer">
                          <option>API token</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold mb-1">API token</label>
                        <select className="w-full border-2 border-black rounded-lg bg-white px-2 py-1.5 text-[10px] focus:outline-none cursor-pointer">
                          <option>Select token</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold mb-1">Webhooks</label>
                        <div className="w-full h-16 border-2 border-black rounded-lg bg-white p-2 text-[10px]" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold mb-1">Webhooks</label>
                        <div className="w-full h-16 border-2 border-black rounded-lg bg-white p-2 text-[10px]" />
                      </div>
                    </div>
                  </div>

                  {/* System Audit Trail & CAPA records */}
                  <div className="bg-[#e5e5e5] border-2 border-black rounded-xl p-5 space-y-4">
                    <h3 className="font-extrabold text-sm">System Audit Trail & CAPA records</h3>
                    <div className="border-2 border-black rounded-lg overflow-hidden bg-white">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b-2 border-black bg-gray-50 text-[9px] font-black uppercase">
                            <th className="border-r-2 border-black py-2 px-2 text-left w-[20%]">Timestamp</th>
                            <th className="border-r-2 border-black py-2 px-2 text-left w-[25%]">Event Identity</th>
                            <th className="border-r-2 border-black py-2 px-2 text-left w-[20%]">Assigned User</th>
                            <th className="border-r-2 border-black py-2 px-2 text-left w-[15%]">Status Code</th>
                            <th className="py-2 px-2 text-center w-[20%]">Compliance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.from({ length: 4 }).map((_, idx) => (
                            <tr key={idx} className="border-b border-black last:border-b-0 h-6">
                              <td className="border-r-2 border-black"></td>
                              <td className="border-r-2 border-black"></td>
                              <td className="border-r-2 border-black"></td>
                              <td className="border-r-2 border-black"></td>
                              <td></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Row 3 Grid: User Profile & Avatar Customization & Security Settings */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* User Profile & Avatar Customization */}
                  <div className="bg-[#e5e5e5] border-2 border-black rounded-xl p-5 space-y-4">
                    <h3 className="font-extrabold text-sm">User Profile & Avatar Customization</h3>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      {/* Avatar preview */}
                      <div className="relative group">
                        <div className="w-20 h-20 border-4 border-black rounded-full overflow-hidden bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                          {avatarUrl ? (
                            <img src={avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-10 h-10 text-gray-500" />
                          )}
                        </div>
                        {/* Hidden File Input */}
                        <label className="absolute bottom-0 right-0 bg-white border-2 border-black rounded-full p-1 cursor-pointer hover:bg-black hover:text-white transition-colors shadow-sm">
                          <span className="text-[10px] font-black px-1">Edit</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Display name and Email inputs */}
                      <div className="flex-1 space-y-3 w-full">
                        <div>
                          <label className="block text-[10px] font-bold mb-1">Display Name</label>
                          <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full border-2 border-black rounded-lg bg-white px-3 py-1 text-xs focus:outline-none font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold mb-1">Email Address</label>
                          <input
                            type="email"
                            value={emailAddress}
                            onChange={(e) => setEmailAddress(e.target.value)}
                            placeholder="john@nexus.io"
                            className="w-full border-2 border-black rounded-lg bg-white px-3 py-1 text-xs focus:outline-none font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security & Account Settings */}
                  <div className="bg-[#e5e5e5] border-2 border-black rounded-xl p-5 space-y-4">
                    <h3 className="font-extrabold text-sm">Security & Account Settings</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold mb-1">New Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full border-2 border-black rounded-lg bg-white px-3 py-1 text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold mb-1">Confirm Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full border-2 border-black rounded-lg bg-white px-3 py-1 text-xs focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2 flex items-center justify-between bg-white border-2 border-black rounded-lg p-2">
                        <div>
                          <h4 className="font-extrabold text-xs">Two-Factor Authentication</h4>
                          <p className="text-[9px] text-gray-500 font-bold">Secure your account with 2FA</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                          className={`px-3 py-1 rounded border-2 border-black text-[10px] font-black cursor-pointer transition-colors ${
                            twoFactorEnabled ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
                          }`}
                        >
                          {twoFactorEnabled ? 'ENABLED' : 'DISABLED'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Open Corrective issue block */}
                <div className="bg-[#e5e5e5] border-2 border-black rounded-xl p-5 space-y-4">
                  <h3 className="text-lg font-black">Open Corrective issue</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* RCA Summary */}
                    <div className="bg-white border-2 border-black rounded-xl p-4 space-y-3 shadow-sm">
                      <h4 className="font-bold text-sm text-gray-800">RCA Summary</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2.5 text-xs font-bold cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={rcaChecklist[0]}
                            onChange={() => setRcaChecklist(prev => [!prev[0], prev[1]])}
                            className="w-4 h-4 border border-black rounded accent-black cursor-pointer"
                          />
                          Checklist
                        </label>
                        <label className="flex items-center gap-2.5 text-xs font-bold cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={rcaChecklist[1]}
                            onChange={() => setRcaChecklist(prev => [prev[0], !prev[1]])}
                            className="w-4 h-4 border border-black rounded accent-black cursor-pointer"
                          />
                          Checklist
                        </label>
                      </div>
                    </div>

                    {/* Assigned QMS */}
                    <div className="bg-white border-2 border-black rounded-xl p-4 space-y-3 shadow-sm">
                      <h4 className="font-bold text-sm text-gray-800">Assigned QMS</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2.5 text-xs font-bold cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={qmsChecklist[0]}
                            onChange={() => setQmsChecklist(prev => [!prev[0], prev[1]])}
                            className="w-4 h-4 border border-black rounded accent-black cursor-pointer"
                          />
                          Checklist #1
                        </label>
                        <label className="flex items-center gap-2.5 text-xs font-bold cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={qmsChecklist[1]}
                            onChange={() => setQmsChecklist(prev => [prev[0], !prev[1]])}
                            className="w-4 h-4 border border-black rounded accent-black cursor-pointer"
                          />
                          Checklist #2
                        </label>
                      </div>
                    </div>

                    {/* Resolution Path */}
                    <div className="bg-white border-2 border-black rounded-xl p-4 space-y-3 shadow-sm">
                      <h4 className="font-bold text-sm text-gray-800">Resolution Path</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2.5 text-xs font-bold cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={resChecklist[0]}
                            onChange={() => setResChecklist(prev => [!prev[0], prev[1]])}
                            className="w-4 h-4 border border-black rounded accent-black cursor-pointer"
                          />
                          Checklist #1
                        </label>
                        <label className="flex items-center gap-2.5 text-xs font-bold cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={resChecklist[1]}
                            onChange={() => setResChecklist(prev => [prev[0], !prev[1]])}
                            className="w-4 h-4 border border-black rounded accent-black cursor-pointer"
                          />
                          Checklist #2
                        </label>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            ) : (
              /* VIEW 2: System API and Integration Specs */
              <div className="space-y-6">
                <h2 className="text-xl font-black">System API and Integration Specs</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Endpoints Explorer (lg:col-span-5) */}
                  <div className="bg-[#e5e5e5] border-2 border-black rounded-xl p-5 space-y-4 lg:col-span-5">
                    <h3 className="font-extrabold text-sm">Endpoints Explorer</h3>
                    
                    {/* Search box */}
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Search className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="text"
                        placeholder="Search Endpoints"
                        className="w-full pl-9 pr-4 py-1.5 bg-black text-white placeholder-gray-400 rounded-full border-2 border-black focus:outline-none text-xs font-bold"
                      />
                    </div>

                    {/* Endpoint Tree */}
                    <div className="space-y-3 font-bold text-xs">
                      {/* Authentication */}
                      <div className="space-y-1.5">
                        <p className="flex items-center gap-1.5 text-gray-600">
                          <span>▼</span> Authentication
                        </p>
                        <div className="pl-4 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-gray-300 border border-black/35 font-mono text-[8px] uppercase">POST</span>
                            <span className="font-mono text-[10px]">/api/v1/auth/login</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-gray-300 border border-black/35 font-mono text-[8px] uppercase">GET</span>
                            <span className="font-mono text-[10px]">/api/v1/auth/login/session</span>
                          </div>
                        </div>
                      </div>

                      {/* Task Management */}
                      <div className="space-y-1.5">
                        <p className="flex items-center gap-1.5 text-gray-600">
                          <span>▼</span> Task Management
                        </p>
                        <div className="pl-4 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-gray-300 border border-black/35 font-mono text-[8px] uppercase">POST</span>
                            <span className="font-mono text-[10px]">/api/v1/tasks/create</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-gray-300 border border-black/35 font-mono text-[8px] uppercase">GET</span>
                            <span className="font-mono text-[10px]">/api/v1/tasks/list</span>
                          </div>
                        </div>
                      </div>

                      {/* Compliance Logs */}
                      <div className="space-y-1.5">
                        <p className="flex items-center gap-1.5 text-gray-600">
                          <span>▼</span> Compliance Logs
                        </p>
                        <div className="pl-4">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-gray-300 border border-black/35 font-mono text-[8px] uppercase">GET</span>
                            <span className="font-mono text-[10px]">/api/v1/audit/logs</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Code runner & Request/Response schemas */}
                  <div className="bg-[#e5e5e5] border-2 border-black rounded-xl p-5 space-y-4 lg:col-span-7">
                    {/* Specification Manager / Code Runner */}
                    <div className="space-y-1.5">
                      <h4 className="font-extrabold text-xs">Specification Manager / Code Runner</h4>
                      <input
                        type="text"
                        readOnly
                        value="POST /api/v1/tasks/create"
                        className="w-full border-2 border-black rounded-lg bg-white px-3 py-1.5 text-xs font-mono focus:outline-none"
                      />
                    </div>

                    {/* Request Body Schema */}
                    <div className="space-y-1.5">
                      <h4 className="font-extrabold text-xs">Request Body Schema (application / json)</h4>
                      <pre className="w-full bg-white border border-[#d4d4d4] rounded-lg p-3 text-[10px] font-mono whitespace-pre overflow-x-auto">
{`{
  "title": "string (required)",
  "project_id": "uuid (required)",
  "priority": "enum [Low, Medium, High, Blocker]"
}`}
                      </pre>
                    </div>

                    {/* Response Model Example */}
                    <div className="space-y-1.5">
                      <h4 className="font-extrabold text-xs">Response Model Example</h4>
                      <pre className="w-full bg-white border border-[#d4d4d4] rounded-lg p-3 text-[10px] font-mono whitespace-pre overflow-x-auto">
{`{
  "status": "success",
  "task_id": "1234-5678-9101"
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}
