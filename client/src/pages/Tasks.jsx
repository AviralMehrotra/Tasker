import React, { useState } from "react";
import { MdAdd, MdFormatListBulleted, MdGridView } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loader";
import Title from "../components/Title";
import Button from "../components/Button";
import Tabs from "../components/Tabs";
import TaskTitle from "../components/TaskTitle";
import BoardView from "../components/BoardView";
import Table from "../components/Table.jsx";
import AddTask from "../components/tasks/AddTask.jsx";
import { useGetAllTaskQuery } from "../redux/slices/api/taskApiSlice.js";

const tabs = [
  {
    title: "Grid View",
    icon: <MdGridView />,
  },
  {
    title: "List View",
    icon: <MdFormatListBulleted />,
  },
];

const taskType = {
  todo: "bg-blue-500",
  "in progress": "bg-yellow-500",
  completed: "bg-green-500",
};

const Tasks = () => {
  const params = useParams();

  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);

  const status = params?.status || "";
  const { data, isLoading } = useGetAllTaskQuery({
    strQuery: status,
    isTrashed: "",
    search: "",
  });

  return isLoading ? (
    <div className="py-10 mt-20">
      <Loading />
    </div>
  ) : (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Title title={status ? `${status} Tasks` : "Tasks"} />

        {!status && (
          <Button
            onClick={() => setOpen(true)}
            label="Create Task"
            icon={<MdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
          />
        )}
      </div>
      <div>
        <Tabs tabs={tabs} setSelected={setSelected}>
          {!status && (
            <div className="w-full flex justify-between gap-4 md:gap-x-12 py-4">
              <TaskTitle label="To Do" className={taskType.todo} />
              <TaskTitle
                label="In Progress"
                className={taskType["in progress"]}
              />
              <TaskTitle label="Completed" className={taskType.completed} />
            </div>
          )}

          {(() => {
            if (selected === 0) {
              return <BoardView tasks={data?.tasks} />;
            } else {
              return <Table tasks={data?.tasks} />;
            }
          })()}
        </Tabs>
        <AddTask open={open} setOpen={setOpen} />
      </div>
    </div>
  );
};

export default Tasks;
