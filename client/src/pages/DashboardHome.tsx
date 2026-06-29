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

interface AuditLog {
  action: string;
  time: string;
}

interface DashboardHomeProps {
  projects: Project[];
  tasks: Task[];
  auditLogs: AuditLog[];
  onCreateTask: () => void;
  onSignOut: () => void;
  activeProjectName: string;
  setActiveProjectName: (name: string) => void;
  onSelectPinned: (item: string) => void;
  onGoToMyTasks: () => void;
  onGoToAnalytics: () => void;
  onGoToSettings: () => void;
}

export default function DashboardHome({
  projects,
  tasks,
  auditLogs,
  onCreateTask,
  onSignOut,
  activeProjectName,
  setActiveProjectName,
  onSelectPinned,
  onGoToMyTasks,
  onGoToAnalytics,
  onGoToSettings
}: DashboardHomeProps) {

  // Dynamic metric calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.priority === 'Low').length; // Mock completion check
  const blockerTasks = tasks.filter(t => t.priority === 'Blocker').length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const velocityRate = totalTasks > 0 ? 100 - Math.round((blockerTasks / totalTasks) * 100) : 0;

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

        {/* Navigation Links with Home Pill Highlight */}
        <nav className="hidden md:flex items-center gap-8 font-extrabold text-sm">
          <span className="bg-black text-white px-4 py-1.5 rounded-full font-bold cursor-pointer border-2 border-black">
            Home
          </span>
          <a href="#" className="hover:underline text-gray-600 font-bold" onClick={onGoToMyTasks}>My Tasks</a>
          <a href="#" className="hover:underline text-gray-600 font-bold" onClick={onGoToAnalytics}>Sprint Analytics</a>
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

          {/* Right Dashboard Area */}
          <section className="flex-1 space-y-6">
            
            {/* Greetings Banner */}
            <div>
              <h2 className="text-xl font-black">Good morning,User</h2>
            </div>

            {/* 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* SPRINT PROGRESS */}
              <div className="bg-[#e5e5e5] border-2 border-blue-500 rounded-xl p-4 shadow-sm space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-700">Sprint Progress</h3>
                <div className="w-full bg-white h-5 rounded-full border-2 border-black overflow-hidden relative">
                  <div 
                    className="bg-black h-full transition-all duration-500" 
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <p className="text-xs font-black text-center">{completionPercentage}%</p>
              </div>

              {/* COMPLETED TASKS */}
              <div className="bg-[#e5e5e5] border-2 border-black rounded-xl p-4 shadow-sm space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-700">Completed Tasks</h3>
                <div className="w-full bg-white h-5 rounded-full border-2 border-black overflow-hidden relative">
                  <div 
                    className="bg-black h-full transition-all duration-500" 
                    style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                  />
                </div>
                <p className="text-xs font-black text-center">{completedTasks}/{totalTasks}</p>
              </div>

              {/* ACTIVE BLOCKERS */}
              <div className="bg-[#e5e5e5] border-2 border-black rounded-xl p-4 shadow-sm space-y-2 flex flex-col justify-between text-center">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-700">Active Blockers</h3>
                <p className="text-2xl font-black">{blockerTasks}</p>
                <p className={`text-[10px] font-black uppercase tracking-wider ${blockerTasks > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                  {blockerTasks > 0 ? 'CRITICAL' : 'NONE'}
                </p>
              </div>

              {/* VELOCITY RATE */}
              <div className="bg-[#e5e5e5] border-2 border-black rounded-xl p-4 shadow-sm space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-700">Velocity Rate</h3>
                <div className="w-full bg-white h-5 rounded-full border-2 border-black overflow-hidden relative">
                  <div 
                    className="bg-black h-full transition-all duration-500" 
                    style={{ width: `${velocityRate}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[9px] font-black text-gray-600 px-1">
                  <span>{velocityRate}%</span>
                  {totalTasks > 0 && <span>▲ 4% from Sprint 3</span>}
                </div>
              </div>
            </div>

            {/* Bottom Grid for Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* ASSIGNED TO ME */}
              <div className="bg-[#e5e5e5] border-2 border-black rounded-xl p-4 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-black">
                  Assigned To Me (GET /api/tasks?assigned=me)
                </h3>
                
                {tasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-black/40 rounded-xl bg-white p-8 text-center text-gray-500 font-bold min-h-[180px]">
                    <p className="text-sm">No tasks assigned to you yet.</p>
                    <button 
                      onClick={onCreateTask} 
                      className="mt-3 text-xs bg-black text-white px-4 py-1.5 rounded-full border-2 border-black font-extrabold hover:bg-white hover:text-black transition-colors cursor-pointer shadow-sm"
                    >
                      + Create Task
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {tasks.map((task, idx) => (
                      <div key={idx} className="bg-white border-2 border-black rounded-xl p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between gap-3">
                        <div className="space-y-1">
                          <p className="font-extrabold text-sm">{task.taskTitle}</p>
                          <div className="flex flex-wrap gap-2 text-[10px] font-bold text-gray-500">
                            <span>Tags: {task.selectedTags.join(', ') || 'None'}</span>
                            <span>|</span>
                            <span>Due: {task.dueDate}</span>
                          </div>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded border border-black text-[9px] font-black uppercase ${
                          task.priority === 'Blocker' 
                            ? 'bg-red-100 text-red-800' 
                            : task.priority === 'High'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* LIVE AUDIT TRAIL */}
              <div className="bg-[#e5e5e5] border-2 border-black rounded-xl p-4 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-black">Live Audit Trail</h3>
                
                {auditLogs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-black/40 rounded-xl bg-white p-8 text-center text-gray-500 font-bold min-h-[180px]">
                    <p className="text-sm">No recent system activities.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {auditLogs.map((log, idx) => (
                      <div key={idx} className="bg-white border-2 border-black rounded-xl p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-bold flex flex-col gap-1">
                        <p className="text-black">• {log.action}</p>
                        <p className="text-[10px] text-gray-400 self-end font-normal">{log.time}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </section>

        </div>
      </main>
    </div>
  );
}
