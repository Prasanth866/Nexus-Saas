import { useState } from 'react';
import { Bell, User } from 'lucide-react';

export default function OrganizationGatewayPage() {
  const [createOrgName, setCreateOrgName] = useState('');
  const [createWorkspace, setCreateWorkspace] = useState('');
  const [createSecurity, setCreateSecurity] = useState('');

  const [joinTarget, setJoinTarget] = useState('');
  const [joinToken, setJoinToken] = useState('');
  const [joinRole, setJoinRole] = useState('');

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

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 font-extrabold text-sm">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">My Tasks</a>
          <a href="#" className="hover:underline">Sprint Analytics</a>
          <a href="#" className="hover:underline">Settings & Compliance</a>
        </nav>

        {/* Profile / Notifications */}
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer">
            <Bell className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer">
            <User className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Gateway Container */}
      <main className="max-w-6xl mx-auto mt-10">
        
        {/* Outer Wireframe Wrapper */}
        <div className="bg-[#e5e5e5] border-2 border-black rounded-xl p-4 shadow-sm">
          
          {/* Black Header Bar */}
          <div className="bg-black text-white px-6 py-3 rounded-lg mb-6">
            <h1 className="text-lg font-bold">Multi-Tenet Administrative Gateway</h1>
          </div>

          {/* Form Blocks (2 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            
            {/* Left Block: Create Organization */}
            <div className="bg-white border-2 border-black rounded-xl p-6 shadow-sm">
              <h2 className="font-bold text-base mb-6">Create A New Organization Block</h2>
              
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold w-1/2">Organization Name:</label>
                  <input 
                    type="text" 
                    value={createOrgName}
                    onChange={(e) => setCreateOrgName(e.target.value)}
                    className="w-1/2 border-2 border-black rounded-full px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-black bg-white" 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold w-1/2">Primary Workspace Identifier:</label>
                  <input 
                    type="text" 
                    value={createWorkspace}
                    onChange={(e) => setCreateWorkspace(e.target.value)}
                    className="w-1/2 border-2 border-black rounded-full px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-black bg-white" 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold w-1/2">Default Security Tier:</label>
                  <input 
                    type="text" 
                    value={createSecurity}
                    onChange={(e) => setCreateSecurity(e.target.value)}
                    className="w-1/2 border-2 border-black rounded-full px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-black bg-white" 
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button 
                  onClick={() => { setCreateOrgName(''); setCreateWorkspace(''); setCreateSecurity(''); }}
                  className="px-6 py-1.5 rounded-full border-2 border-black font-bold text-sm bg-[#d4d4d4] hover:bg-black hover:text-white transition-colors shadow-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  className="px-6 py-1.5 rounded-full border-2 border-black font-bold text-sm bg-[#d4d4d4] hover:bg-black hover:text-white transition-colors shadow-sm cursor-pointer"
                >
                  Create Enterprise
                </button>
              </div>
            </div>

            {/* Right Block: Join Organization */}
            <div className="bg-white border-2 border-black rounded-xl p-6 shadow-sm">
              <h2 className="font-bold text-base mb-6">Join Existing Organization Block</h2>
              
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold w-1/2">Target Admin Username or Org ID:</label>
                  <input 
                    type="text" 
                    value={joinTarget}
                    onChange={(e) => setJoinTarget(e.target.value)}
                    className="w-1/2 border-2 border-black rounded-full px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-black bg-white" 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold w-1/2">Request Token / Access Note:</label>
                  <input 
                    type="text" 
                    value={joinToken}
                    onChange={(e) => setJoinToken(e.target.value)}
                    className="w-1/2 border-2 border-black rounded-full px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-black bg-white" 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold w-1/2">Your Access Role:</label>
                  <input 
                    type="text" 
                    value={joinRole}
                    onChange={(e) => setJoinRole(e.target.value)}
                    className="w-1/2 border-2 border-black rounded-full px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-black bg-white" 
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button 
                  onClick={() => { setJoinTarget(''); setJoinToken(''); setJoinRole(''); }}
                  className="px-6 py-1.5 rounded-full border-2 border-black font-bold text-sm bg-[#d4d4d4] hover:bg-black hover:text-white transition-colors shadow-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  className="px-6 py-1.5 rounded-full border-2 border-black font-bold text-sm bg-[#d4d4d4] hover:bg-black hover:text-white transition-colors shadow-sm cursor-pointer"
                >
                  Join Enterprise
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Table */}
          <div className="w-full overflow-hidden rounded-lg border-2 border-black">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="border-r-2 border-black py-4 font-bold text-center w-1/4">Organization</th>
                  <th className="border-r-2 border-black py-4 font-bold text-center w-1/4">Workspace</th>
                  <th className="border-r-2 border-black py-4 font-bold text-center w-1/4">Projects</th>
                  <th className="py-4 font-bold text-center w-1/4">Security Level</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b-2 border-black">
                  <td className="border-r-2 border-black h-12"></td>
                  <td className="border-r-2 border-black h-12"></td>
                  <td className="border-r-2 border-black h-12"></td>
                  <td className="h-12"></td>
                </tr>
                <tr className="border-b-2 border-black">
                  <td className="border-r-2 border-black h-12"></td>
                  <td className="border-r-2 border-black h-12"></td>
                  <td className="border-r-2 border-black h-12"></td>
                  <td className="h-12"></td>
                </tr>
                <tr>
                  <td className="border-r-2 border-black h-12"></td>
                  <td className="border-r-2 border-black h-12"></td>
                  <td className="border-r-2 border-black h-12"></td>
                  <td className="h-12"></td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </main>

    </div>
  );
}