import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Users from "./pages/Users";
import TaskDetails from "./pages/TaskDetails";
import Trash from "./pages/Trash";
import { Route, Routes, Navigate, Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { setOpenSidebar } from "./redux/slices/authSlice";
import { Fragment, useRef } from "react";
import clsx from "clsx";
import { IoMdClose } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { Transition } from "@headlessui/react";

function Layout() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  return user ? (
    <div className="w-full h-screen flex flex-col md:flex-row">
      <div className="w-1/5 h-screen bg-white sticky top-0 hidden md:block">
        <Sidebar />
      </div>
      <MobileSidebar />
      <div className="flex-1 overflow-y-auto">
        <Navbar />
        <div className="p-4 2xl:px-10">
          <Outlet />
        </div>
      </div>
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
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {/* {(ref) => (
          <div
            ref={(node) => (mobileMenuRef.current = node)}
            className={clsx(
              "md:hidden w-full h-full bg-black/40 transition-all duration-700 transform ",
              isSidebarOpen ? "translate-x-0" : "translate-x-full"
            )}
            onClick={() => closeSidebar()}
          >
            <div className="bg-white w-3/4 h-full">
              <div className="w-full flex justify-end px-5 pt-5">
                <button
                  onClick={() => closeSidebar()}
                  className="flex justify-end items-end"
                >
                  <IoClose size={25} />
                </button>
              </div>

              <div className="-mt-10">
                <Sidebar />
              </div>
            </div>
          </div>
        )} */}
        {/* edit starts here */}
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 z-40 md:hidden"
          onClick={closeSidebar}
        >
          <div className="fixed inset-0 bg-black/40" />
          <div className="fixed inset-y-0 left-0 w-3/4 bg-white">
            <div className="w-full flex justify-end px-5 pt-5">
              <button
                onClick={closeSidebar}
                className="flex justify-end items-end"
              >
                <IoClose size={25} />
              </button>
            </div>
            <div className="-mt-10">
              <Sidebar />
            </div>
          </div>
        </div>
        {/* edit ends here */}
      </Transition>
    </>
  );
};

function App() {
  return (
    <main className="w-full min-h-screen bg-[#f3f4f6]">
      <Routes>
        <Route element={<Layout />}>
          <Route index path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/task/:id" element={<TaskDetails />} />
          <Route path="/completed/:status" element={<Tasks />} />
          <Route path="/in-progress/:status" element={<Tasks />} />
          <Route path="/todo/:status" element={<Tasks />} />
          <Route path="/team" element={<Users />} />
          <Route path="/trashed" element={<Trash />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
      <Toaster richColors />
    </main>
  );
}

export default App;
