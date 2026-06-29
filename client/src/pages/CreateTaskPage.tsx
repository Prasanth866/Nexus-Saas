import { useState } from 'react';
import { Bell, User } from 'lucide-react';

interface CreateTaskPageProps {
  onCancel: () => void;
  onCreate: (taskData: any) => void;
}

export default function CreateTaskPage({ onCancel, onCreate }: CreateTaskPageProps) {
  // Sidebar state
  const [activeProject, setActiveProject] = useState('Nexus core');

  // Form states
  const [taskTitle, setTaskTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetProject, setTargetProject] = useState('Select Project Repository');
  const [assignee, setAssignee] = useState('Search Team Members.....');
  const [priority, setPriority] = useState('Low');
  const [dueDate, setDueDate] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = ['Front-end', 'Back-end', 'QMS Compliance', 'Bug'];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      taskTitle,
      description,
      targetProject,
      assignee,
      priority,
      dueDate,
      selectedTags
    });
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

      {/* Main Workspace Layout */}
      <main className="max-w-7xl mx-auto mt-10 px-4">
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Left Sidebar */}
          <aside className="w-full md:w-64 bg-[#e5e5e5] border-2 border-black rounded-xl p-4 flex flex-col justify-between min-h-[500px]">
            <div className="space-y-4">
              {/* Dropdown project selector */}
              <div className="relative">
                <select
                  value={activeProject}
                  onChange={(e) => setActiveProject(e.target.value)}
                  className="w-full border-2 border-black rounded-lg px-3 py-2 bg-white font-extrabold text-sm cursor-pointer focus:outline-none"
                >
                  <option value="Nexus core">Nexus core</option>
                  <option value="Nexus mobile">Nexus mobile</option>
                  <option value="Wayne Enterprises">Wayne Enterprises</option>
                </select>
              </div>

              {/* + New Task Button */}
              <button
                type="button"
                className="w-full bg-black text-white border-2 border-black rounded-lg px-3 py-2 font-extrabold text-sm hover:bg-[#d4d4d4] hover:text-black transition-colors cursor-pointer"
              >
                + New Task
              </button>

              {/* Pinned Projects Box */}
              <div className="bg-white border-2 border-black rounded-xl p-4 space-y-3">
                <h3 className="font-extrabold text-sm uppercase tracking-wide border-b border-black/10 pb-1.5">Pinned</h3>
                <ul className="space-y-2 text-xs font-bold">
                  <li className="flex items-center gap-2">
                    <span className="text-black">•</span> Nexus-Front
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-black">•</span> Nexus-Back
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-black">•</span> Qms-Docs
                  </li>
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

          {/* Right Main Form Container */}
          <section className="flex-1 bg-[#e5e5e5] border-2 border-black rounded-xl p-4 md:p-6 shadow-sm">
            {/* Header Bar */}
            <div className="bg-black text-white px-6 py-3 rounded-lg mb-6">
              <h1 className="text-lg font-bold">Create Task</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Task Title Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold">Task Title Input</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Enter Task Summary or Issue Description"
                  className="w-full border-2 border-black rounded-lg px-4 py-2 bg-white focus:outline-none text-sm"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write detailed technical requirements,reproduction steps or QA criteria"
                  className="w-full h-32 border-2 border-black rounded-lg px-4 py-2 bg-white focus:outline-none text-sm resize-none"
                />
              </div>

              {/* Grid 2x2 for parameters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Assign to Project */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold">Assign to Project</label>
                  <select
                    value={targetProject}
                    onChange={(e) => setTargetProject(e.target.value)}
                    className="w-full border-2 border-black bg-white rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer"
                  >
                    <option value="Select Project Repository">Select Project Repository</option>
                    <option value="Nexus-Front Repository">Nexus-Front Repository</option>
                    <option value="Nexus-Back Repository">Nexus-Back Repository</option>
                    <option value="Qms-Docs Repository">Qms-Docs Repository</option>
                  </select>
                </div>

                {/* Assignee Selection */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold">Assignee Selection</label>
                  <select
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    className="w-full border-2 border-black bg-white rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer"
                  >
                    <option value="Search Team Members.....">Search Team Members.....</option>
                    <option value="Developer Admin">Developer Admin (admin@nexus.io)</option>
                    <option value="Barath Anandh">Barath Anandh (barath@nexus.io)</option>
                    <option value="Prasanth">Prasanth (prasanth@nexus.io)</option>
                  </select>
                </div>

                {/* Priority Tier */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold">Priority Tier</label>
                  <div className="flex border-2 border-black rounded-lg overflow-hidden bg-white">
                    {['Low', 'Medium', 'High', 'Blocker'].map((tier) => (
                      <button
                        type="button"
                        key={tier}
                        onClick={() => setPriority(tier)}
                        className={`flex-1 py-1.5 text-xs font-bold cursor-pointer transition-colors border-r-2 last:border-r-0 border-black hover:bg-gray-100 ${
                          priority === tier ? 'bg-black text-white hover:bg-black' : 'bg-white text-black'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Due Date Selection */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold">Due Date Selection</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full border-2 border-black rounded-lg px-3 py-1.5 bg-white text-sm focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Labels / Tags Multi-Select */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold">Labels / Tags Multi-Select</label>
                <div className="flex flex-wrap gap-3">
                  {allTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-4 py-1 rounded-full border-2 border-black text-xs font-bold cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#d4d4d4] text-black' : 'bg-white text-gray-500'
                        }`}
                      >
                        + {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex justify-end gap-4 pt-4 border-t border-black/10">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-8 py-1.5 rounded-full border-2 border-black font-bold text-sm bg-white hover:bg-black hover:text-white transition-colors shadow-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-1.5 rounded-full border-2 border-black font-bold text-sm bg-black text-white hover:bg-[#d4d4d4] hover:text-black transition-colors shadow-sm cursor-pointer"
                >
                  +New Task
                </button>
              </div>
            </form>
          </section>

        </div>
      </main>
    </div>
  );
}
