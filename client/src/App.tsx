import { useState } from 'react'
import AuthPage from './pages/AuthPage'
import DemoPage from './pages/DemoPage'
import OrganizationGatewayPage from './pages/OrganizationGatewayPage'
import CreateProjectPage from './pages/CreateProjectPage'
import CreateTaskPage from './pages/CreateTaskPage'
import DashboardHome from './pages/DashboardHome'
import KanbanBoardPage from './pages/KanbanBoardPage'
import TaskListViewPage from './pages/TaskListViewPage'
import SprintAnalyticsPage from './pages/SprintAnalyticsPage'
import SettingsCompliancePage from './pages/SettingsCompliancePage'

function App() {
  const [page, setPage] = useState<'demo' | 'login' | 'signup' | 'gateway' | 'dashboard' | 'create-project' | 'create-task' | 'kanban-board' | 'my-tasks' | 'sprint-analytics' | 'settings-compliance'>('demo')

  // Central React States
  const [projects, setProjects] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [auditLogs, setAuditLogs] = useState<any[]>([])
  const [activeProjectName, setActiveProjectName] = useState('Nexus core')
  const [activePinnedItem, setActivePinnedItem] = useState('Nexus-Front')

  if (page === 'demo') {
    return <DemoPage onOpenAuth={(mode) => setPage(mode ?? 'login')} />
  }

  if (page === 'gateway') {
    return <OrganizationGatewayPage onSelectOrg={() => setPage('dashboard')} />
  }

  if (page === 'dashboard') {
    return (
      <DashboardHome
        projects={projects}
        tasks={tasks}
        auditLogs={auditLogs}
        onCreateTask={() => setPage('create-task')}
        onSignOut={() => setPage('demo')}
        activeProjectName={activeProjectName}
        setActiveProjectName={setActiveProjectName}
        onSelectPinned={(item) => {
          setActivePinnedItem(item);
          setPage('kanban-board');
        }}
        onGoToMyTasks={() => setPage('my-tasks')}
        onGoToAnalytics={() => setPage('sprint-analytics')}
        onGoToSettings={() => setPage('settings-compliance')}
      />
    )
  }

  if (page === 'kanban-board') {
    return (
      <KanbanBoardPage 
        projects={projects}
        tasks={tasks}
        activeProjectName={activeProjectName}
        setActiveProjectName={setActiveProjectName}
        activePinnedItem={activePinnedItem}
        setActivePinnedItem={setActivePinnedItem}
        onGoHome={() => setPage('dashboard')}
        onCreateTask={() => setPage('create-task')}
        onSignOut={() => setPage('demo')}
        onGoToMyTasks={() => setPage('my-tasks')}
        onGoToAnalytics={() => setPage('sprint-analytics')}
        onGoToSettings={() => setPage('settings-compliance')}
      />
    )
  }

  if (page === 'my-tasks') {
    return (
      <TaskListViewPage
        projects={projects}
        tasks={tasks}
        activeProjectName={activeProjectName}
        setActiveProjectName={setActiveProjectName}
        onSelectPinned={(item) => {
          setActivePinnedItem(item);
          setPage('kanban-board');
        }}
        onGoHome={() => setPage('dashboard')}
        onCreateTask={() => setPage('create-task')}
        onSignOut={() => setPage('demo')}
        onGoToAnalytics={() => setPage('sprint-analytics')}
        onGoToSettings={() => setPage('settings-compliance')}
      />
    )
  }

  if (page === 'sprint-analytics') {
    return (
      <SprintAnalyticsPage 
        projects={projects}
        tasks={tasks}
        activeProjectName={activeProjectName}
        setActiveProjectName={setActiveProjectName}
        onSelectPinned={(item) => {
          setActivePinnedItem(item);
          setPage('kanban-board');
        }}
        onGoHome={() => setPage('dashboard')}
        onGoToMyTasks={() => setPage('my-tasks')}
        onCreateTask={() => setPage('create-task')}
        onSignOut={() => setPage('demo')}
        onGoToSettings={() => setPage('settings-compliance')}
      />
    )
  }

  if (page === 'settings-compliance') {
    return (
      <SettingsCompliancePage
        projects={projects}
        activeProjectName={activeProjectName}
        setActiveProjectName={setActiveProjectName}
        onSelectPinned={(item) => {
          setActivePinnedItem(item);
          setPage('kanban-board');
        }}
        onGoHome={() => setPage('dashboard')}
        onGoToMyTasks={() => setPage('my-tasks')}
        onGoToAnalytics={() => setPage('sprint-analytics')}
        onCreateTask={() => setPage('create-task')}
        onSignOut={() => setPage('demo')}
      />
    )
  }

  if (page === 'create-project') {
    return (
      <CreateProjectPage 
        onCancel={() => setPage('dashboard')} 
        onCreate={(projectData) => {
          setProjects(prev => [...prev, { name: projectData.projectSummary, workspace: projectData.workspaceSlug ?? 'wayne-corp', security: projectData.createSecurityTier ?? 'Tier 1' }]);
          setAuditLogs(prev => [{ action: `Created project "${projectData.projectSummary}"`, time: 'Just now' }, ...prev]);
          alert('Project created successfully!');
          setPage('create-task');
        }}
      />
    )
  }

  if (page === 'create-task') {
    return (
      <CreateTaskPage 
        onCancel={() => setPage('dashboard')} 
        onCreate={(taskData) => {
          setTasks(prev => [...prev, taskData]);
          setAuditLogs(prev => [{ action: `Created task "${taskData.taskTitle}" in ${taskData.targetProject}`, time: 'Just now' }, ...prev]);
          alert('Task created successfully!');
          setPage('dashboard');
        }}
      />
    )
  }

  return <AuthPage initialMode={page} onAuthSuccess={() => setPage('gateway')} />
}

export default App
