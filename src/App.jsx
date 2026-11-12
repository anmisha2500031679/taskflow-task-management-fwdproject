
import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate
} from 'react-router-dom'

import './App.css'

// =====================================
// STORAGE HELPERS
// =====================================

const getStored = (key, fallback) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : fallback
  } catch {
    return fallback
  }
}

const makeId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const makeRoomCode = () =>
  'TF' + Math.random().toString(36).slice(2, 7).toUpperCase()


// =====================================
// HOME / ROLE SELECTION
// =====================================

function Home() {
  const navigate = useNavigate()

  return (
    <section className="page-section">
      <div className="landing-container">

        <div className="brand-badge">TASKFLOW</div>

        <h1>Task Management System</h1>

        <p className="landing-subtitle">
          Organize. Assign. Accomplish.
        </p>

        <p className="landing-description">
          A simple workspace for managers and candidates
          to manage tasks and track progress.
        </p>

        <div className="role-grid">

          <button
            className="role-card"
            onClick={() => navigate('/manager')}
          >
            <div className="role-icon">👥</div>
            <h2>Manager</h2>
            <p>Create your workspace and assign tasks.</p>
            <span className="role-action">Continue →</span>
          </button>

          <button
            className="role-card"
            onClick={() => navigate('/candidate')}
          >
            <div className="role-icon">👤</div>
            <h2>Candidate</h2>
            <p>Join a workspace and manage your tasks.</p>
            <span className="role-action">Continue →</span>
          </button>

        </div>
      </div>
    </section>
  )
}


// =====================================
// AUTHENTICATION PAGE
// =====================================

function AuthPage({ role, users, setUsers, onLogin }) {
  const navigate = useNavigate()

  const [authMode, setAuthMode] = useState('login')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    roomCode: ''
  })

  const updateForm = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const changeMode = (mode) => {
    setAuthMode(mode)
    setError('')
    setMessage('')
  }

  const handleRegister = (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    const name = form.name.trim()
    const username = form.username.trim()
    const email = form.email.trim().toLowerCase()
    const password = form.password

    if (!name || !username || !email || !password) {
      setError('Please fill in all required fields.')
      return
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.')
      return
    }

    if (users.some(
      u => u.username.toLowerCase() === username.toLowerCase()
    )) {
      setError('Username already exists. Choose another one.')
      return
    }

    if (users.some(u => u.email === email)) {
      setError('Email is already registered.')
      return
    }

    let roomCode = ''

    if (role === 'manager') {
      roomCode = makeRoomCode()
    } else {
      roomCode = form.roomCode.trim().toUpperCase()

      const managerExists = users.some(
        u => u.role === 'manager' && u.roomCode === roomCode
      )

      if (!roomCode || !managerExists) {
        setError('Invalid room code. Ask your manager for the correct code.')
        return
      }
    }

    const newUser = {
      id: makeId(),
      name,
      username,
      email,
      password,
      role,
      roomCode
    }

    setUsers(prev => [...prev, newUser])

    if (role === 'manager') {
      setMessage(`Account created! Your room code is ${roomCode}`)
    } else {
      setMessage('Account created successfully! You can now login.')
    }

    setForm({
      name: '',
      username: '',
      email: '',
      password: '',
      roomCode: ''
    })

    setAuthMode('login')
  }

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    const username = form.username.trim().toLowerCase()

    const foundUser = users.find(
      u =>
        u.username.toLowerCase() === username &&
        u.password === form.password &&
        u.role === role
    )

    if (!foundUser) {
      setError('Invalid username or password.')
      return
    }

    onLogin(foundUser)

    navigate(role === 'manager' ? '/manager/dashboard' : '/candidate/dashboard')
  }

  return (
    <section className="page-section">

      <div className="auth-container">
        <div className="auth-card">

          <button
            type="button"
            className="back-button"
            onClick={() => navigate('/')}
          >
            ← Back
          </button>

          <div className="brand-badge">TASKFLOW</div>

          <h1>
            {role === 'manager' ? 'Manager' : 'Candidate'} Portal
          </h1>

          <p>Welcome to TaskFlow</p>

          <div className="auth-tabs">

            <button
              type="button"
              className={authMode === 'login' ? 'active' : ''}
              onClick={() => changeMode('login')}
            >
              Login
            </button>

            <button
              type="button"
              className={authMode === 'register' ? 'active' : ''}
              onClick={() => changeMode('register')}
            >
              Register
            </button>

          </div>

          {error && (
            <div className="notification error-message">
              {error}
            </div>
          )}

          {message && (
            <div className="notification success-message">
              {message}
            </div>
          )}

          {authMode === 'login' ? (

            <form onSubmit={handleLogin}>

              <h2>Login to your account</h2>

              <label>
                Username
                <input
                  name="username"
                  value={form.username}
                  onChange={updateForm}
                  placeholder="Enter your username"
                  required
                />
              </label>

              <label>
                Password
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={updateForm}
                  placeholder="Enter your password"
                  required
                />
              </label>

              <button type="submit" className="primary-button">
                Login
              </button>

            </form>

          ) : (

            <form onSubmit={handleRegister}>

              <h2>Create an account</h2>

              <label>
                Full Name
                <input
                  name="name"
                  value={form.name}
                  onChange={updateForm}
                  placeholder="Enter your full name"
                  required
                />
              </label>

              <label>
                Username
                <input
                  name="username"
                  value={form.username}
                  onChange={updateForm}
                  placeholder="Choose a username"
                  required
                />
              </label>

              <label>
                Email
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateForm}
                  placeholder="Enter your email"
                  required
                />
              </label>

              <label>
                Password
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={updateForm}
                  placeholder="Create a password"
                  minLength={6}
                  required
                />
              </label>

              {role === 'candidate' && (
                <label>
                  Room Code
                  <input
                    name="roomCode"
                    value={form.roomCode}
                    onChange={updateForm}
                    placeholder="Enter manager's room code"
                    required
                  />
                </label>
              )}

              <button type="submit" className="primary-button">
                Register
              </button>

            </form>

          )}

        </div>
      </div>
    </section>
  )
}


// =====================================
// PROTECTED ROUTE
// =====================================

function ProtectedRoute({ user, role, children }) {
  if (!user || user.role !== role) {
    return <Navigate to={`/${role}`} replace />
  }

  return children
}


// =====================================
// SIDEBAR
// =====================================

function Sidebar({ user, active, setActive, onLogout }) {
  const menu = user.role === 'manager'
    ? ['Overview', 'Candidates', 'Tasks', 'Progress']
    : ['Overview', 'My Tasks', 'History']

  return (
    <aside className="sidebar">

      <div className="sidebar-logo">TASKFLOW</div>

      <p style={{ color: '#D7D0E3', fontSize: 13 }}>
        {user.role === 'manager' ? 'MANAGER WORKSPACE' : 'CANDIDATE WORKSPACE'}
      </p>

      <div className="sidebar-menu">

        {menu.map(item => (
          <button
            key={item}
            className={active === item ? 'active' : ''}
            onClick={() => setActive(item)}
          >
            {item === 'Overview' && '▦ '}
            {item === 'Candidates' && '👥 '}
            {item === 'Tasks' && '✓ '}
            {item === 'Progress' && '▥ '}
            {item === 'My Tasks' && '📋 '}
            {item === 'History' && '◷ '}
            {item}
          </button>
        ))}

        <button onClick={onLogout}>
          ↪ Logout
        </button>

      </div>

      <div style={{ marginTop: 'auto', color: '#E8E3F0', fontSize: 13 }}>
        Logged in as
        <strong style={{ display: 'block', marginTop: 5 }}>
          {user.name}
        </strong>
      </div>

    </aside>
  )
}


// =====================================
// TASK FORM - ADD AND EDIT
// =====================================

function TaskForm({
  task,
  candidates,
  onSave,
  onClose
}) {
  const [title, setTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [priority, setPriority] = useState(task?.priority || 'Medium')
  const [dueDate, setDueDate] = useState(task?.dueDate || '')
  const [dueTime, setDueTime] = useState(task?.dueTime || '')
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo || 'all')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!title.trim() || !description.trim() || !dueDate) {
      return
    }

    onSave({
      id: task?.id || makeId(),
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      dueTime,
      assignedTo,
      completedBy: task?.completedBy || [],
      createdAt: task?.createdAt || new Date().toISOString()
    })
  }

  return (
    <div className="modal-overlay">

      <div className="modal-content">

        <h2>{task ? 'Edit Task' : 'Create New Task'}</h2>

        <form onSubmit={handleSubmit}>

          <label>
            Task Title
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </label>

          <label>
            Description
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the task"
              required
            />
          </label>

          <label>
            Priority
            <select
              value={priority}
              onChange={e => setPriority(e.target.value)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
          </label>

          <label>
            Assign To
            <select
              value={assignedTo}
              onChange={e => setAssignedTo(e.target.value)}
            >
              <option value="all">Entire Room</option>

              {candidates.map(candidate => (
                <option
                  key={candidate.id}
                  value={candidate.username}
                >
                  {candidate.name} (@{candidate.username})
                </option>
              ))}
            </select>
          </label>

          <label>
            Due Date
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              required
            />
          </label>

          <label>
            Due Time
            <input
              type="time"
              value={dueTime}
              onChange={e => setDueTime(e.target.value)}
            />
          </label>

          <div className="modal-actions">

            <button type="submit" className="save-button">
              {task ? 'Save Changes' : 'Create Task'}
            </button>

            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>

          </div>

        </form>
      </div>
    </div>
  )
}


// =====================================
// TASK CARD
// =====================================

function TaskCard({
  task,
  isManager,
  currentUser,
  candidates,
  onEdit,
  onDelete,
  onComplete
}) {
  const completed = task.completedBy.includes(currentUser.username)

  const assignedNames = task.assignedTo === 'all'
    ? 'Entire Room'
    : candidates.find(c => c.username === task.assignedTo)?.name || task.assignedTo

  const priorityClass = task.priority.toLowerCase()

  return (
    <div className="task-card">

      <div className="task-info">

        <h3>{task.title}</h3>

        <p>{task.description}</p>

        <p>
          Assigned to: <strong>{assignedNames}</strong>
        </p>

        <p>
          Due: {task.dueDate}
          {task.dueTime ? ` at ${task.dueTime}` : ''}
        </p>

        <p>
          Priority: <strong>{task.priority}</strong>
        </p>

        {isManager ? (

          <span className="task-status">
            Completed: {task.completedBy.length} / {
              task.assignedTo === 'all'
                ? candidates.length
                : 1
            }
          </span>

        ) : (

          <span className={`status ${completed ? 'completed' : 'pending'}`}>
            {completed ? 'Completed' : 'Pending'}
          </span>

        )}

      </div>

      <div className="task-actions">

        {isManager ? (

          <>
            <button
              className="edit-button"
              onClick={() => onEdit(task)}
            >
              ✎ Edit
            </button>

            <button
              className="delete-button"
              onClick={() => onDelete(task.id)}
            >
              Delete
            </button>
          </>

        ) : (

          <button
            className={completed ? 'secondary-button' : 'complete-button'}
            onClick={() => onComplete(task.id)}
            disabled={completed}
          >
            {completed ? 'Completed ✓' : 'Mark Complete'}
          </button>

        )}

      </div>

    </div>
  )
}


// =====================================
// MANAGER DASHBOARD
// =====================================

function ManagerDashboard({
  user,
  users,
  tasks,
  setTasks,
  onLogout
}) {
  const [active, setActive] = useState('Overview')
  const [editingTask, setEditingTask] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const candidates = users.filter(
    u => u.role === 'candidate' && u.roomCode === user.roomCode
  )

  const roomTasks = tasks.filter(
    t => t.managerId === user.id
  )

  const completedCount = roomTasks.reduce(
    (total, task) => total + task.completedBy.length,
    0
  )

  const totalAssignments = roomTasks.reduce(
    (total, task) =>
      total + (task.assignedTo === 'all' ? candidates.length : 1),
    0
  )

  const progress = totalAssignments
    ? Math.round((completedCount / totalAssignments) * 100)
    : 0

  const saveTask = (taskData) => {
    if (editingTask) {
      setTasks(prev =>
        prev.map(t =>
          t.id === taskData.id ? { ...taskData, managerId: user.id } : t
        )
      )
    } else {
      setTasks(prev => [
        ...prev,
        { ...taskData, managerId: user.id }
      ])
    }

    setShowForm(false)
    setEditingTask(null)
  }

  const deleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(t => t.id !== id))
    }
  }

  const openEdit = (task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const allCandidateTasks = (candidate) =>
    roomTasks.filter(
      t => t.assignedTo === 'all' || t.assignedTo === candidate.username
    )

  return (
    <div className="dashboard-layout">

      <Sidebar
        user={user}
        active={active}
        setActive={setActive}
        onLogout={onLogout}
      />

      <main className="main-content">

        <div className="dashboard-header">
          <div>
            <h1>
              {active === 'Overview' ? 'Manager Dashboard' : active}
            </h1>
            <p>Welcome back, {user.name}!</p>
          </div>

          <span className="status completed">Manager</span>
        </div>

        {active === 'Overview' && (
          <>
            <div className="candidate-welcome">
              <h1>Welcome to your workspace!</h1>
              <p>Manage your room, assign tasks and track your team.</p>
              <p style={{ marginTop: 12 }}>
                Room Code: <strong>{user.roomCode}</strong>
              </p>
            </div>

            <div className="stats-grid">

              <div className="stat-card">
                <h3>Total Candidates</h3>
                <h2>{candidates.length}</h2>
              </div>

              <div className="stat-card">
                <h3>Total Tasks</h3>
                <h2>{roomTasks.length}</h2>
              </div>

              <div className="stat-card">
                <h3>Completed Assignments</h3>
                <h2>{completedCount}</h2>
              </div>

              <div className="stat-card">
                <h3>Team Progress</h3>
                <h2>{progress}%</h2>
              </div>

            </div>

            <div className="progress-card">
              <h2>Overall Team Progress</h2>

              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="progress-text">
                {completedCount} of {totalAssignments} assignments completed
              </p>
            </div>

            <div className="dashboard-panel">
              <h2>Quick Actions</h2>

              <button
                className="add-task-button"
                onClick={() => {
                  setEditingTask(null)
                  setShowForm(true)
                }}
              >
                + Create New Task
              </button>

              <button
                className="secondary-button"
                style={{ marginLeft: 10 }}
                onClick={() => setActive('Candidates')}
              >
                View Candidates
              </button>
            </div>
          </>
        )}

        {active === 'Candidates' && (
          <div className="dashboard-panel">

            <h2>Room Members</h2>

            <p>Room Code: <strong>{user.roomCode}</strong></p>

            <div className="candidate-grid">

              {candidates.map(candidate => {
                const candidateTasks = allCandidateTasks(candidate)

                const done = candidateTasks.filter(
                  t => t.completedBy.includes(candidate.username)
                ).length

                return (
                  <div className="candidate-card" key={candidate.id}>

                    <div className="candidate-avatar">
                      {candidate.name.charAt(0).toUpperCase()}
                    </div>

                    <h3>{candidate.name}</h3>

                    <p>@{candidate.username}</p>

                    <p>{candidate.email}</p>

                    <p>
                      Completed: {done}/{candidateTasks.length}
                    </p>

                    <div className="progress-container">
                      <div
                        className="progress-bar"
                        style={{
                          width: `${
                            candidateTasks.length
                              ? done / candidateTasks.length * 100
                              : 0
                          }%`
                        }}
                      />
                    </div>

                  </div>
                )
              })}

              {candidates.length === 0 && (
                <p>No candidates have joined your room yet.</p>
              )}

            </div>
          </div>
        )}

        {active === 'Tasks' && (
          <div className="dashboard-panel">

            <div className="dashboard-header">
              <h2>Manage Tasks</h2>

              <button
                className="add-task-button"
                onClick={() => {
                  setEditingTask(null)
                  setShowForm(true)
                }}
              >
                + Add Task
              </button>
            </div>

            <div className="task-list">

              {roomTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isManager
                  currentUser={user}
                  candidates={candidates}
                  onEdit={openEdit}
                  onDelete={deleteTask}
                />
              ))}

              {roomTasks.length === 0 && (
                <div className="empty-state">
                  No tasks created yet. Create your first task!
                </div>
              )}

            </div>
          </div>
        )}

        {active === 'Progress' && (
          <div className="dashboard-panel">

            <h2>Candidate Progress</h2>

            {candidates.map(candidate => {
              const candidateTasks = allCandidateTasks(candidate)

              const done = candidateTasks.filter(
                t => t.completedBy.includes(candidate.username)
              ).length

              const percentage = candidateTasks.length
                ? Math.round(done / candidateTasks.length * 100)
                : 0

              return (
                <div key={candidate.id} className="candidate-details">

                  <h3>{candidate.name}</h3>

                  <p>{done} of {candidateTasks.length} tasks completed</p>

                  <div className="progress-container">
                    <div
                      className="progress-bar"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <strong>{percentage}%</strong>

                </div>
              )
            })}

          </div>
        )}

      </main>

      {showForm && (
        <TaskForm
          task={editingTask}
          candidates={candidates}
          onSave={saveTask}
          onClose={() => {
            setShowForm(false)
            setEditingTask(null)
          }}
        />
      )}

    </div>
  )
}


// =====================================
// CANDIDATE DASHBOARD
// =====================================

function CandidateDashboard({
  user,
  tasks,
  setTasks,
  onLogout
}) {
  const [active, setActive] = useState('Overview')

  const myTasks = tasks.filter(
    task =>
      task.managerRoomCode === user.roomCode ||
      (
        task.assignedTo === 'all' &&
        task.roomCode === user.roomCode
      ) ||
      (
        task.assignedTo === user.username &&
        task.roomCode === user.roomCode
      )
  )

  // Manager ID is used to identify the room owner.
  // The room code is added to every task when it is created below.
  const visibleTasks = myTasks.filter(
    task =>
      task.assignedTo === 'all' ||
      task.assignedTo === user.username
  )

  const pending = visibleTasks.filter(
    t => !t.completedBy.includes(user.username)
  )

  const completed = visibleTasks.filter(
    t => t.completedBy.includes(user.username)
  )

  const completeTask = (id) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id !== id) return task

        return {
          ...task,
          completedBy: task.completedBy.includes(user.username)
            ? task.completedBy
            : [...task.completedBy, user.username]
        }
      })
    )
  }

  const filteredTasks = active === 'History'
    ? completed
    : active === 'My Tasks'
      ? pending
      : visibleTasks

  return (
    <div className="dashboard-layout">

      <Sidebar
        user={user}
        active={active}
        setActive={setActive}
        onLogout={onLogout}
      />

      <main className="main-content">

        <div className="dashboard-header">
          <div>
            <h1>{active === 'Overview' ? 'My Dashboard' : active}</h1>
            <p>Welcome, {user.name}!</p>
          </div>
          <span className="status completed">Candidate</span>
        </div>

        {active === 'Overview' && (
          <>
            <div className="candidate-welcome">
              <h1>Hello, {user.name}!</h1>
              <p>Here is your personal task overview.</p>
            </div>

            <div className="stats-grid">

              <div className="stat-card">
                <h3>Total Tasks</h3>
                <h2>{visibleTasks.length}</h2>
              </div>

              <div className="stat-card">
                <h3>Pending</h3>
                <h2>{pending.length}</h2>
              </div>

              <div className="stat-card">
                <h3>Completed</h3>
                <h2>{completed.length}</h2>
              </div>

              <div className="stat-card">
                <h3>Progress</h3>
                <h2>
                  {visibleTasks.length
                    ? Math.round(completed.length / visibleTasks.length * 100)
                    : 0}%
                </h2>
              </div>

            </div>

            <div className="dashboard-panel">
              <h2>Recent Tasks</h2>

              {visibleTasks.slice(0, 3).map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isManager={false}
                  currentUser={user}
                  candidates={[]}
                  onComplete={completeTask}
                />
              ))}

              {visibleTasks.length === 0 && (
                <div className="empty-state">
                  No tasks assigned yet.
                </div>
              )}
            </div>
          </>
        )}

        {(active === 'My Tasks' || active === 'History') && (
          <div className="dashboard-panel">

            <h2>{active}</h2>

            <div className="task-list">

              {filteredTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isManager={false}
                  currentUser={user}
                  candidates={[]}
                  onComplete={completeTask}
                />
              ))}

              {filteredTasks.length === 0 && (
                <div className="empty-state">
                  No tasks to display.
                </div>
              )}

            </div>
          </div>
        )}

      </main>
    </div>
  )
}


// =====================================
// MAIN APP WITH ROUTING AND STORAGE
// =====================================

function App() {

  const [users, setUsers] = useState(
    () => getStored('taskflow_users', [])
  )

  const [tasks, setTasks] = useState(
    () => getStored('taskflow_tasks', [])
  )

  const [currentUser, setCurrentUser] = useState(
    () => getStored('taskflow_currentUser', null)
  )

  useEffect(() => {
    localStorage.setItem('taskflow_users', JSON.stringify(users))
  }, [users])

  useEffect(() => {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        'taskflow_currentUser',
        JSON.stringify(currentUser)
      )
    } else {
      localStorage.removeItem('taskflow_currentUser')
    }
  }, [currentUser])

  const logout = () => {
    setCurrentUser(null)
  }

  // Add room code to new tasks using manager's room.
  const updateTasks = (updater) => {
    setTasks(prev => {
      const next = typeof updater === 'function'
        ? updater(prev)
        : updater

      return next.map(task => {
        if (!task.roomCode) {
          const manager = users.find(
            u => u.id === task.managerId
          )

          return {
            ...task,
            roomCode: manager?.roomCode || ''
          }
        }

        return task
      })
    })
  }

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/manager"
          element={
            <AuthPage
              role="manager"
              users={users}
              setUsers={setUsers}
              onLogin={setCurrentUser}
            />
          }
        />

        <Route
          path="/candidate"
          element={
            <AuthPage
              role="candidate"
              users={users}
              setUsers={setUsers}
              onLogin={setCurrentUser}
            />
          }
        />

        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute user={currentUser} role="manager">
              <ManagerDashboard
                user={currentUser}
                users={users}
                tasks={tasks}
                setTasks={updateTasks}
                onLogout={logout}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate/dashboard"
          element={
            <ProtectedRoute user={currentUser} role="candidate">
              <CandidateDashboard
                user={currentUser}
                tasks={tasks}
                setTasks={updateTasks}
                onLogout={logout}
              />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Home />} />

      </Routes>

    </BrowserRouter>
  )
}

export default App
