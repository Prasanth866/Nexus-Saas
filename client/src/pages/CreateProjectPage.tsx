import { useState } from 'react';
import { Bell, User } from 'lucide-react';

interface CreateProjectPageProps {
  onCancel: () => void;
  onCreate: (projectData: any) => void;
}

export default function CreateProjectPage({ onCancel, onCreate }: CreateProjectPageProps) {
  // Input states
  const [projectSummary, setProjectSummary] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Front-end', 'Back-end', 'QMS Compliance', 'Bug']);
  const [searchUser, setSearchUser] = useState('');
  const [sprintsAllocated, setSprintsAllocated] = useState('Total Spirints Allocated');
  const [velocityStretch, setVelocityStretch] = useState('2 Weeks');
  const [launchDate, setLaunchDate] = useState('');

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
      projectSummary,
      selectedTags,
      searchUser,
      sprintsAllocated,
      velocityStretch,
      launchDate
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

      {/* Main Gateway Container */}
      <main className="max-w-6xl mx-auto mt-10">
        {/* Outer Wireframe Wrapper */}
        <div className="bg-[#e5e5e5] border-2 border-black rounded-xl p-4 shadow-sm">
          {/* Black Header Bar */}
          <div className="bg-black text-white px-6 py-3 rounded-lg mb-6">
            <h1 className="text-lg font-bold">Create New Project Platform Container</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project identity Input */}
            <div className="space-y-2">
              <label className="block text-sm font-bold">Project identity Input</label>
              <input
                type="text"
                value={projectSummary}
                onChange={(e) => setProjectSummary(e.target.value)}
                placeholder="Enter Project Summary or Issue Description"
                className="w-full border-2 border-black rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-black text-sm"
              />
            </div>

            {/* Channels & Repositories configuration (Muilt-Select Tag Field) */}
            <div className="space-y-2">
              <label className="block text-sm font-bold">Channels & Repositories configuration (Muilt-Select Tag Field)</label>
              <div className="flex flex-wrap items-center gap-3 border-2 border-black bg-white rounded-lg p-3">
                {allTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-4 py-1.5 rounded-full border-2 border-black font-bold text-xs cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#d4d4d4] text-black' : 'bg-white text-gray-500'
                      }`}
                    >
                      + {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grid layout for two blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Block: Assign Core Team Members */}
              <div className="bg-white border-2 border-black rounded-xl p-6 shadow-sm flex flex-col justify-between min-h-[220px]">
                <div className="space-y-4">
                  <h2 className="font-bold text-base border-b border-gray-200 pb-2">Assign Core Team Members</h2>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700">Grid:Team Access Allocation</label>
                    <input
                      type="text"
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                      placeholder="Search team username..."
                      className="w-full border-2 border-black rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-black text-sm bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Right Block: Spirit Protocol Life */}
              <div className="bg-white border-2 border-black rounded-xl p-6 shadow-sm space-y-4 min-h-[220px]">
                <h2 className="font-bold text-base border-b border-gray-200 pb-2">Spirit Protocol Life</h2>
                
                <div className="space-y-3">
                  {/* Spirit Retrospective Lifecycle Dropdown */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Spirit Retrospective Lifecycle</label>
                    <select
                      value={sprintsAllocated}
                      onChange={(e) => setSprintsAllocated(e.target.value)}
                      className="w-full border-2 border-black bg-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-black text-sm cursor-pointer"
                    >
                      <option value="Total Spirints Allocated">Total Spirints Allocated</option>
                      <option value="1 Spirit">1 Spirit Allocated</option>
                      <option value="2 Spirits">2 Spirits Allocated</option>
                      <option value="3 Spirits">3 Sprints Allocated</option>
                      <option value="4 Spirits">4 Sprints Allocated</option>
                    </select>
                  </div>

                  {/* Spirit Lifecycle Velocity Stretch Radios */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Spirit Lifecycle Velocity Stretch</label>
                    <div className="flex gap-4">
                      <label className="inline-flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                        <input
                          type="radio"
                          name="velocity"
                          checked={velocityStretch === '2 Weeks'}
                          onChange={() => setVelocityStretch('2 Weeks')}
                          className="w-4 h-4 border-2 border-black focus:ring-0 cursor-pointer accent-black"
                        />
                        2 Weeks
                      </label>
                      <label className="inline-flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                        <input
                          type="radio"
                          name="velocity"
                          checked={velocityStretch === '3 Weeks'}
                          onChange={() => setVelocityStretch('3 Weeks')}
                          className="w-4 h-4 border-2 border-black focus:ring-0 cursor-pointer accent-black"
                        />
                        3 Weeks
                      </label>
                    </div>
                  </div>

                  {/* Date Input */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Spirit Lifecycle Velocity Stretch</label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold w-1/3">Launch Frame Start:</span>
                      <input
                        type="date"
                        value={launchDate}
                        onChange={(e) => setLaunchDate(e.target.value)}
                        className="w-2/3 border-2 border-black rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-black text-sm bg-white cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
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
                +New Project
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
