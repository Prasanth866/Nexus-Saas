import { Bell, User } from 'lucide-react';

interface Project {
  name: string;
  workspace: string;
  security: string;
}

interface Task {
  taskTitle: string;
  description: string;
  targetProject: string;
  assignee: string;
  priority: string;
  dueDate: string;
  selectedTags: string[];
}

interface SprintAnalyticsPageProps {
  projects: Project[];
  tasks: Task[];
  activeProjectName: string;
  setActiveProjectName: (name: string) => void;
  onSelectPinned: (item: string) => void;
  onGoHome: () => void;
  onGoToMyTasks: () => void;
  onCreateTask: () => void;
  onSignOut: () => void;
  onGoToSettings: () => void;
}

export default function SprintAnalyticsPage({
  projects,
  tasks,
  activeProjectName,
  setActiveProjectName,
  onSelectPinned,
  onGoHome,
  onGoToMyTasks,
  onCreateTask,
  onSignOut,
  onGoToSettings
}: SprintAnalyticsPageProps) {

  // Dynamic calculations based on tasks
  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter(t => t.priority === 'Low').length;
  const progressPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;
  
  // Member points calculation
  const memberPoints: Record<string, number> = {};
  tasks.forEach(t => {
    const points = t.priority === 'Blocker' ? 5 : t.priority === 'High' ? 3 : t.priority === 'Medium' ? 2 : 1;
    memberPoints[t.assignee] = (memberPoints[t.assignee] || 0) + points;
  });

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

        {/* Navigation Links with Sprint Analytics highlighted */}
        <nav className="hidden md:flex items-center gap-8 font-extrabold text-sm">
          <a href="#" className="hover:underline text-gray-600 font-bold" onClick={onGoHome}>Home</a>
          <a href="#" className="hover:underline text-gray-600 font-bold" onClick={onGoToMyTasks}>My Tasks</a>
          <span className="bg-black text-white px-4 py-1.5 rounded-full font-bold cursor-pointer border-2 border-black">
            Sprint Analytics
          </span>
          <a href="#" className="hover:underline text-gray-600 font-bold" onClick={onGoToSettings}>Settings & Compliance</a>
        </nav>

        {/* Profile / Notifications */}
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer">
            <Bell className="w-5 h-5" />
          </button>
          <button 
            onClick={onSignOut}
            title="Sign Out"
            className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer"
          >
            <User className="w-5 h-5" />
          </button>
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
              <div className="w-12 h-12 border-2 border-black rounded-full flex items-center justify-center bg-white shadow-sm">
                <User className="w-6 h-6" />
              </div>
            </div>
          </aside>

          {/* Right Main Analytics Panel */}
          <section className="flex-1 bg-white border-2 border-black rounded-xl p-4 md:p-6 shadow-sm space-y-6">
            
            {/* Header Box (Spirit 1 Performance Metrics) */}
            <div className="border-2 border-blue-500 rounded-lg p-3 bg-white w-full shadow-[2px_2px_0px_0px_rgba(29,78,216,1)]">
              <h2 className="font-black text-lg text-black">Spirit 1 Performance Metrics</h2>
            </div>

            {/* Row 1 of Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Story Points Burn-down Chart */}
              <div className="bg-white border-2 border-black rounded-xl p-4 flex flex-col justify-between min-h-[300px]">
                <h3 className="font-bold text-sm text-gray-700 mb-2">Story Points</h3>
                <div className="flex-1 relative flex items-center justify-center">
                  {/* Burndown SVG line chart */}
                  <svg viewBox="0 0 120 80" className="w-full h-full font-mono text-[6px]">
                    {/* Grid lines */}
                    <line x1="15" y1="10" x2="110" y2="10" stroke="#f0f0f0" strokeWidth="0.5" />
                    <line x1="15" y1="30" x2="110" y2="30" stroke="#f0f0f0" strokeWidth="0.5" />
                    <line x1="15" y1="50" x2="110" y2="50" stroke="#f0f0f0" strokeWidth="0.5" />
                    <line x1="15" y1="70" x2="110" y2="70" stroke="#000" strokeWidth="1" />
                    
                    {/* Y Axis line */}
                    <line x1="15" y1="10" x2="15" y2="70" stroke="#000" strokeWidth="1" />
                    
                    {/* Y Labels */}
                    <text x="5" y="12" textAnchor="middle">15</text>
                    <text x="5" y="32" textAnchor="middle">10</text>
                    <text x="5" y="52" textAnchor="middle">5</text>
                    <text x="5" y="72" textAnchor="middle">0</text>
                    
                    {/* X Labels */}
                    <text x="15" y="78" textAnchor="middle">0</text>
                    <text x="40" y="78" textAnchor="middle">5</text>
                    <text x="65" y="78" textAnchor="middle">10</text>
                    <text x="90" y="78" textAnchor="middle">15</text>
                    <text x="112" y="78" textAnchor="middle">20</text>

                    {/* Descending burndown line path */}
                    {totalTasksCount > 0 && (
                      <path 
                        d="M 15 10 L 40 26 L 65 50 L 97 70 L 110 70" 
                        fill="none" 
                        stroke="#000" 
                        strokeWidth="1.5" 
                      />
                    )}
                  </svg>
                </div>
              </div>

              {/* Member Velocity Chart */}
              <div className="bg-[#e5e5e5] border-2 border-black rounded-xl p-4 flex flex-col justify-between min-h-[300px]">
                <div>
                  <h3 className="font-bold text-sm text-gray-700 mb-1">Member Velocity</h3>
                  <div className="text-[9px] text-gray-500 font-bold space-y-0.5 mb-3">
                    {totalTasksCount > 0 ? (
                      Object.entries(memberPoints).map(([member, pts]) => (
                        <p key={member}>{member} - {pts}pts</p>
                      ))
                    ) : (
                      <p>No member velocity logged.</p>
                    )}
                  </div>
                </div>

                <div className="flex-1 relative flex items-end">
                  {/* Member velocity SVG bar chart */}
                  <svg viewBox="0 0 100 60" className="w-full h-full font-mono text-[5px]">
                    <line x1="10" y1="10" x2="10" y2="50" stroke="#000" strokeWidth="0.8" />
                    <line x1="10" y1="50" x2="90" y2="50" stroke="#000" strokeWidth="0.8" />
                    
                    {/* Y Labels */}
                    <text x="4" y="12" textAnchor="middle">15</text>
                    <text x="4" y="25" textAnchor="middle">10</text>
                    <text x="4" y="38" textAnchor="middle">5</text>
                    <text x="4" y="52" textAnchor="middle">0</text>

                    {/* Bars */}
                    {totalTasksCount > 0 && (
                      <>
                        <rect x="20" y="10" width="10" height="40" fill="#000" />
                        <rect x="36" y="28" width="10" height="22" fill="#000" />
                        <rect x="52" y="18" width="10" height="32" fill="#000" />
                        <rect x="68" y="24" width="10" height="26" fill="#000" />
                      </>
                    )}
                  </svg>
                </div>
              </div>

              {/* Sprint Progress Donut */}
              <div className="bg-[#e5e5e5] border-2 border-black rounded-xl p-4 flex flex-col justify-between min-h-[300px]">
                <h3 className="font-bold text-sm text-gray-700 mb-2">Sprint Progress</h3>
                <div className="flex-1 flex items-center justify-center bg-white border border-[#d4d4d4] rounded-lg p-6">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* Radial progress ring SVG */}
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      {/* Background circle */}
                      <path
                        className="text-gray-200"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      {/* Foreground blue circle representing percentage */}
                      <path
                        className="text-blue-600"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeDasharray={`${progressPercent}, 100`}
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    {/* Centered label */}
                    <span className="absolute text-sm font-black text-blue-600">{progressPercent}%</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Row 2 of Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Scope Compliance Summary */}
              <div className="bg-[#e5e5e5] border-2 border-black rounded-xl p-5 flex flex-col justify-between min-h-[220px]">
                <h3 className="font-bold text-sm text-gray-700 mb-4">Scope Compliance Summary</h3>
                <div className="space-y-3">
                  <div className="bg-white border-2 border-black rounded-lg px-4 py-2 text-xs font-bold">
                    Planned Points: {totalTasksCount > 0 ? totalTasksCount * 10 : 0}
                  </div>
                  <div className="bg-white border-2 border-black rounded-lg px-4 py-2 text-xs font-bold">
                    Completed Points: {completedTasksCount > 0 ? completedTasksCount * 10 : 0}
                  </div>
                </div>
              </div>

              {/* Cycle Times Chart */}
              <div className="bg-[#e5e5e5] border-2 border-black rounded-xl p-4 flex flex-col justify-between min-h-[220px]">
                <div>
                  <h3 className="font-bold text-sm text-gray-700 mb-1">Cycle Times</h3>
                  <p className="text-[10px] font-bold text-gray-500 mb-2">
                    Mean time to Dev: {totalTasksCount > 0 ? '2.4' : '0.0'} Days
                  </p>
                </div>
                <div className="flex-1 bg-white border border-[#d4d4d4] rounded-lg p-3 flex items-end">
                  {/* Cycle times SVG chart */}
                  <svg viewBox="0 0 100 50" className="w-full h-full">
                    {/* Bottom axis line */}
                    <line x1="5" y1="45" x2="95" y2="45" stroke="#000" strokeWidth="0.8" />
                    
                    {/* Cycle jagged path */}
                    {totalTasksCount > 0 && (
                      <path 
                        d="M 5 45 L 25 45 L 45 35 L 65 42 L 75 25 L 90 25 L 90 45" 
                        fill="none" 
                        stroke="#000" 
                        strokeWidth="1" 
                      />
                    )}
                    {/* Grid divider marks */}
                    <line x1="25" y1="45" x2="25" y2="5" stroke="#000" strokeWidth="0.5" strokeDasharray="1" />
                    <line x1="45" y1="45" x2="45" y2="5" stroke="#000" strokeWidth="0.5" strokeDasharray="1" />
                    <line x1="65" y1="45" x2="65" y2="5" stroke="#000" strokeWidth="0.5" strokeDasharray="1" />
                    <line x1="75" y1="45" x2="75" y2="5" stroke="#000" strokeWidth="0.5" strokeDasharray="1" />
                  </svg>
                </div>
              </div>

              {/* Code Risks and Audit Flags */}
              <div className="bg-[#e5e5e5] border-2 border-black rounded-xl p-4 flex flex-col justify-between min-h-[220px]">
                <h3 className="font-bold text-sm text-gray-700 mb-4">Code Risks and Audit Flags</h3>
                <div className="bg-white border border-[#d4d4d4] rounded-lg p-4 flex-1 space-y-2 text-xs font-bold">
                  <p>QA holds : {totalTasksCount > 0 ? '1.2d' : '0.0d'}</p>
                  <p>CAPA logs : {totalTasksCount > 0 ? '3' : '0'}</p>
                </div>
              </div>

            </div>

          </section>

        </div>
      </main>
    </div>
  );
}
