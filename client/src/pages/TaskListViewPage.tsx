import { useState } from 'react';
import { Bell, User, Search } from 'lucide-react';

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

interface TaskListViewPageProps {
  projects: Project[];
  tasks: Task[];
  activeProjectName: string;
  setActiveProjectName: (name: string) => void;
  onSelectPinned: (item: string) => void;
  onGoHome: () => void;
  onCreateTask: () => void;
  onSignOut: () => void;
  onGoToAnalytics: () => void;
  onGoToSettings: () => void;
}

export default function TaskListViewPage({
  projects,
  tasks,
  activeProjectName,
  setActiveProjectName,
  onSelectPinned,
  onGoHome,
  onCreateTask,
  onSignOut,
  onGoToAnalytics,
  onGoToSettings
}: TaskListViewPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState('Group By');
  const [sortBy, setSortBy] = useState('Sort By');

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(t => 
    t.taskTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.targetProject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRows = 10;
  const taskRowsCount = filteredTasks.length;
  const emptyRowsCount = Math.max(0, totalRows - taskRowsCount);

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

        {/* Navigation Links with My Tasks highlighted */}
        <nav className="hidden md:flex items-center gap-8 font-extrabold text-sm">
          <a href="#" className="hover:underline text-gray-600 font-bold" onClick={onGoHome}>Home</a>
          <span className="bg-black text-white px-4 py-1.5 rounded-full font-bold cursor-pointer border-2 border-black">
            My Tasks
          </span>
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

          {/* Right Main Table Area */}
          <section className="flex-1 bg-[#e5e5e5] border-2 border-black rounded-xl p-4 md:p-6 shadow-sm flex flex-col justify-between">
            <div>
              {/* Search & Actions Topbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                {/* Search box (black pill) */}
                <div className="relative w-full sm:w-80">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search"
                    className="w-full pl-9 pr-4 py-1.5 bg-black text-white placeholder-gray-400 rounded-full border-2 border-black focus:outline-none text-sm font-bold"
                  />
                </div>

                {/* Dropdowns */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <select
                    value={groupBy}
                    onChange={(e) => setGroupBy(e.target.value)}
                    className="bg-black text-white font-bold text-xs px-4 py-2 rounded-full border-2 border-black cursor-pointer focus:outline-none"
                  >
                    <option>Group By</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-black text-white font-bold text-xs px-4 py-2 rounded-full border-2 border-black cursor-pointer focus:outline-none"
                  >
                    <option>Sort By</option>
                  </select>
                </div>
              </div>

              {/* Table Container */}
              <div className="border-2 border-black rounded-xl overflow-hidden bg-white shadow-sm">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-black bg-gray-50 text-xs font-bold">
                      <th className="border-r-2 border-black py-3 px-4 text-center w-[8%]">
                        <input type="checkbox" readOnly checked={taskRowsCount > 0} className="w-4 h-4 border-2 border-black accent-black rounded cursor-pointer" />
                      </th>
                      <th className="border-r-2 border-black py-3 px-4 text-left w-[42%]">Task Title</th>
                      <th className="border-r-2 border-black py-3 px-4 text-center w-[20%]">Project</th>
                      <th className="border-r-2 border-black py-3 px-4 text-center w-[15%]">Priority</th>
                      <th className="py-3 px-4 text-center w-[15%]">Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Rendered tasks */}
                    {filteredTasks.map((task, idx) => (
                      <tr key={idx} className="border-b-2 border-black text-xs font-bold">
                        <td className="border-r-2 border-black py-3.5 px-4 text-center">
                          <input type="checkbox" readOnly checked={true} className="w-4 h-4 border-2 border-black accent-black rounded cursor-pointer" />
                        </td>
                        <td className="border-r-2 border-black py-3.5 px-4 text-left">
                          {task.taskTitle} (Ref:#FB-{102 + idx * 3})
                        </td>
                        <td className="border-r-2 border-black py-3.5 px-4 text-center">
                          <span className="bg-gray-100 px-3 py-1 rounded-full border border-black/30 font-mono text-[10px]">
                            #{task.targetProject.toLowerCase().replace(/[^a-z]/g, '') || 'nexus-front'}
                          </span>
                        </td>
                        <td className="border-r-2 border-black py-3.5 px-4 text-center">
                          <span className="bg-gray-200 px-3 py-1 rounded border border-black/30 text-[10px]">
                            {task.priority}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center text-gray-500">
                          {task.dueDate ? task.dueDate : 'Due Date'}
                        </td>
                      </tr>
                    ))}

                    {/* Empty placeholder rows to fill the wireframe grid exactly */}
                    {Array.from({ length: emptyRowsCount }).map((_, idx) => (
                      <tr key={`empty-${idx}`} className="border-b-2 border-black last:border-b-0 text-xs h-12">
                        <td className="border-r-2 border-black py-3.5 px-4 text-center">
                          <input type="checkbox" disabled className="w-4 h-4 border border-gray-300 rounded" />
                        </td>
                        <td className="border-r-2 border-black py-3.5 px-4"></td>
                        <td className="border-r-2 border-black py-3.5 px-4"></td>
                        <td className="border-r-2 border-black py-3.5 px-4"></td>
                        <td className="py-3.5 px-4"></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
