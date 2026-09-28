import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import MyTasks from "./pages/MyTasks";
import ActivityFeed from "./pages/ActivityFeed";
import CalendarView from "./pages/CalendarView";
import Users from "./pages/Users";
import TaskDetails from "./pages/TaskDetails";
import Trash from "./pages/Trash";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import { Route, Routes, Navigate, Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { setOpenSidebar } from "./redux/slices/authSlice";
import { Fragment, useRef, useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { Transition } from "@headlessui/react";
import CommandPalette from "./components/CommandPalette";
import { Analytics } from "@vercel/analytics/react";

function Layout() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  return user ? (
    <div className="w-full h-screen flex flex-col md:flex-row bg-[#fbfbfa] dark:bg-[#08090d] text-slate-900 dark:text-[#f4f4f6] transition-colors duration-200 overflow-hidden bg-grain">
      <div className="w-64 h-screen bg-white dark:bg-[#0c0e15] sticky top-0 hidden md:block shrink-0 border-r border-slate-200 dark:border-[#1d202d]">
        <Sidebar />
      </div>
      <MobileSidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Navbar onOpenCommandPalette={() => setIsCommandOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </main>
      </div>
      <CommandPalette isOpen={isCommandOpen} setIsOpen={setIsCommandOpen} />
    </div>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

const MobileSidebar = () => {
  const { isSidebarOpen } = useSelector((state) => state.auth);
  const mobileMenuRef = useRef(null);
  const dispatch = useDispatch();

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  return (
    <>
      <Transition
        show={isSidebarOpen}
        as={Fragment}
        enter="transition-opacity duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 z-50 md:hidden"
          onClick={closeSidebar}
        >
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" />
          <div
            className="fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-white dark:bg-[#0c0e15] shadow-2xl flex flex-col border-r border-slate-200 dark:border-[#1d202d]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex justify-end p-4">
              <button
                onClick={closeSidebar}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-[#161924] transition-colors cursor-pointer"
                aria-label="Close sidebar"
              >
                <IoClose size={20} />
              </button>
            </div>
            <div className="-mt-6 flex-1 h-full overflow-y-auto">
              <Sidebar />
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
};

const ROUTE_TITLES = {
  "/": "Tasker — Agile Project Orchestration",
  "/login": "Sign In — Tasker",
  "/dashboard": "Dashboard — Tasker",
  "/tasks": "Sprint Tasks — Tasker",
  "/my-tasks": "My Assigned Tasks — Tasker",
  "/activity": "Activity Audit — Tasker",
  "/calendar": "Milestones & Deadlines — Tasker",
  "/team": "Team Directory — Tasker",
  "/trashed": "Trash Recovery — Tasker",
  "/privacy": "Privacy Policy — Tasker",
  "/terms": "Terms of Service — Tasker",
};

function App() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/task/")) {
      document.title = "Task Details — Tasker";
    } else if (
      path.startsWith("/completed/") ||
      path.startsWith("/in-progress/") ||
      path.startsWith("/todo/")
    ) {
      document.title = "Tasks — Tasker";
    } else if (ROUTE_TITLES[path]) {
      document.title = ROUTE_TITLES[path];
    } else {
      document.title = "404 Page Not Found — Tasker";
    }
  }, [location.pathname]);

  return (
    <main className="w-full min-h-screen bg-[#fbfbfa] dark:bg-[#08090d] text-slate-900 dark:text-[#f4f4f6] transition-colors duration-200">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/my-tasks" element={<MyTasks />} />
          <Route path="/activity" element={<ActivityFeed />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/task/:id" element={<TaskDetails />} />
          {/* Legacy stage filters routing to Tasks */}
          <Route path="/completed/:status" element={<Tasks />} />
          <Route path="/in-progress/:status" element={<Tasks />} />
          <Route path="/todo/:status" element={<Tasks />} />
          <Route path="/team" element={<Users />} />
          <Route path="/trashed" element={<Trash />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        {/* Wildcard 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster richColors />
      <Analytics />
    </main>
  );
}

export default App;
