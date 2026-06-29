import { Bell, User, Folder } from 'lucide-react';

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

interface KanbanBoardPageProps {
  projects: Project[];
  tasks: Task[];
  activeProjectName: string;
  setActiveProjectName: (name: string) => void;
  activePinnedItem: string;
  setActivePinnedItem: (item: string) => void;
  onGoHome: () => void;
  onCreateTask: () => void;
  onSignOut: () => void;
  onGoToMyTasks: () => void;
  onGoToAnalytics: () => void;
  onGoToSettings: () => void;
}

export default function KanbanBoardPage({
  projects,
  tasks,
  activeProjectName,
  setActiveProjectName,
  activePinnedItem,
  setActivePinnedItem,
  onGoHome,
  onCreateTask,
  onSignOut,
  onGoToMyTasks,
  onGoToAnalytics,
  onGoToSettings
}: KanbanBoardPageProps) {

  // Filter tasks belonging to the active project
  const projectTasks = tasks.filter(t => t.targetProject.toLowerCase().includes(activePinnedItem.toLowerCase()));

  // Categorize tasks into Kanban columns
  const getTasksByStatus = (status: string) => {
    // If priority mapping or custom status is used:
    if (status === 'To-Do') {
      return projectTasks.filter(t => t.priority === 'Medium' || t.priority === 'High');
    }
    if (status === 'In-Progress') {
      return projectTasks.filter(t => t.priority === 'Blocker');
    }
    if (status === 'Under-Review') {
      return [];
    }
    if (status === 'Completed') {
      return projectTasks.filter(t => t.priority === 'Low');
    }
    return [];
  };

  const columns = ['To-Do', 'In-Progress', 'Under-Review', 'Completed'];

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

        {/* Navigation Links with Home pill */}
        <nav className="hidden md:flex items-center gap-8 font-extrabold text-sm">
          <span 
            onClick={onGoHome}
            className="bg-black text-white px-4 py-1.5 rounded-full font-bold cursor-pointer border-2 border-black"
          >
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
          <aside className="w-full md:w-64 bg-[#e5e5e5] border-2 border-black rounded-xl p-4 flex flex-col justify-between min-h-[550px]">
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
                <div className="flex flex-col gap-2 text-xs font-bold">
                  {['Nexus-Front', 'Nexus-Back', 'Qma-Docs'].map((item) => {
                    const isSelected = activePinnedItem.toLowerCase().replace(/[^a-z]/g, '') === item.toLowerCase().replace(/[^a-z]/g, '');
                    return (
                      <button
                        key={item}
                        onClick={() => setActivePinnedItem(item)}
                        className={`text-left flex items-center gap-2 cursor-pointer py-1.5 px-3 rounded-full border-2 transition-all ${
                          isSelected 
                            ? 'bg-black text-white border-black' 
                            : 'bg-white text-black border-transparent hover:border-black/20'
                        }`}
                      >
                        <span className={isSelected ? 'text-white' : 'text-black'}>•</span> {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom profile avatar placeholder */}
            <div className="mt-8 pt-4 border-t border-black/10 flex justify-start">
              <div className="w-12 h-12 border-2 border-black rounded-full flex items-center justify-center bg-white shadow-sm">
                <User className="w-6 h-6" />
              </div>
            </div>
          </aside>

          {/* Right Main Board Panel */}
          <section className="flex-1 bg-[#e5e5e5] border-2 border-black rounded-xl p-4 md:p-6 shadow-sm flex flex-col justify-between">
            {/* Header row */}
            <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-6">
              <div className="flex items-center gap-2">
                <Folder className="w-5 h-5" />
                <h2 className="font-black text-lg">{activePinnedItem}</h2>
              </div>
              <div>
                <select className="border-2 border-black rounded-lg bg-white px-3 py-1 text-xs font-bold focus:outline-none cursor-pointer">
                  <option>Contributors</option>
                </select>
              </div>
            </div>

            {/* Board Columns Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {columns.map((colName) => {
                const colTasks = getTasksByStatus(colName);
                return (
                  <div key={colName} className="space-y-4">
                    {/* Column Header */}
                    <div className="bg-black text-white py-2 rounded-lg text-center font-bold text-xs">
                      {colName}
                    </div>

                    {/* Column Body Container */}
                    <div className="space-y-3 bg-[#f0f0f0] border-2 border-black/10 rounded-xl p-3 min-h-[400px]">
                      {colTasks.length === 0 ? (
                        /* Empty placeholder cards exactly matching user's screenshot layout */
                        <>
                          <div className="bg-white border border-[#d4d4d4] rounded-lg h-20 w-full" />
                          <div className="bg-white border border-[#d4d4d4] rounded-lg h-20 w-full" />
                          <div className="bg-white border border-[#d4d4d4] rounded-lg h-20 w-full" />
                          <div className="bg-white border border-[#d4d4d4] rounded-lg h-20 w-full" />
                        </>
                      ) : (
                        colTasks.map((task, idx) => (
                          <div key={idx} className="bg-white border-2 border-black rounded-xl p-3 shadow-sm space-y-2">
                            <p className="font-extrabold text-xs">{task.taskTitle}</p>
                            <div className="flex flex-wrap gap-1 text-[8px] font-bold text-gray-500">
                              {task.selectedTags.map(t => (
                                <span key={t} className="bg-gray-100 px-1 rounded">{t}</span>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
