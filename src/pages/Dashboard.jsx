import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Sidebar from "../components/Sidebar";

const API = "http://localhost:5000";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      const [projectResponse, taskResponse] = await Promise.all([
        fetch(`${API}/projects`),
        fetch(`${API}/tasks`),
      ]);

      const projectData = await projectResponse.json();
      const taskData = await taskResponse.json();

      setProjects(projectData);
      setTasks(taskData);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredTasks =
    activeFilter === "All"
      ? tasks
      : tasks.filter((task) => task.status === activeFilter);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <h4>Loading dashboard...</h4>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">

        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 p-0">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="col-md-9 col-lg-10 p-4">

          {/* Dashboard Header */}
          <div className="border-bottom pb-3 mb-4">
            <h1 className="text-center mb-0">
              Workasana Dashboard
            </h1>
          </div>

          {/* Projects */}
          <section className="mb-5">
            <h2 className="mb-3">Projects</h2>

            <div className="row g-3">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <div
                    className="col-md-4"
                    key={project._id}
                  >
                    <div className="card h-100">
                      <div className="card-body">
                        <h5 className="card-title">
                          {project.name}
                        </h5>

                        <p className="card-text text-muted">
                          {project.description ||
                            "No description available"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <p>No projects available.</p>
                </div>
              )}
            </div>
          </section>

          {/* My Tasks */}
          <section>

            <div className="border-top border-bottom">

              <h2 className="py-3 mb-0">
                My Tasks:
              </h2>

              {/* Task List */}
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div
                    key={task._id}
                    className="border-top py-3"
                  >
                    <div className="row align-items-center">

                      {/* Task Name */}
                      <div className="col-md-5">
                        <strong>{task.name}</strong>
                      </div>

                      {/* Due Date */}
                      <div className="col-md-3 text-muted">
                        [{task.dueDate
                          ? new Date(
                              task.dueDate
                            ).toLocaleDateString()
                          : "Due Date"}]
                      </div>

                      {/* Owner */}
                      <div className="col-md-3 text-muted">
                        [Owner]
                      </div>

                      {/* View */}
                      <div className="col-md-1">
                        <Link
                          to={`/tasks/${task._id}`}
                          className="text-decoration-none"
                        >
                          View
                        </Link>
                      </div>

                    </div>
                  </div>
                ))
              ) : (
                <div className="py-3">
                  <p className="text-muted mb-0">
                    No tasks found.
                  </p>
                </div>
              )}

            </div>

            {/* Add New Task */}
            <div className="border-bottom py-3">
              <Link
                to="/tasks/new"
                className="btn btn-dark"
              >
                Add New Task
              </Link>
            </div>

            {/* Quick Filters */}
            <div className="py-3">
              <strong>Quick Filters:</strong>

              <button
                className={`btn btn-sm ms-2 ${
                  activeFilter === "In Progress"
                    ? "btn-dark"
                    : "btn-outline-dark"
                }`}
                onClick={() =>
                  setActiveFilter("In Progress")
                }
              >
                In Progress
              </button>

              <button
                className={`btn btn-sm ms-2 ${
                  activeFilter === "Completed"
                    ? "btn-dark"
                    : "btn-outline-dark"
                }`}
                onClick={() =>
                  setActiveFilter("Completed")
                }
              >
                Completed
              </button>

              <button
                className={`btn btn-sm ms-2 ${
                  activeFilter === "All"
                    ? "btn-dark"
                    : "btn-outline-dark"
                }`}
                onClick={() =>
                  setActiveFilter("All")
                }
              >
                All
              </button>
            </div>

          </section>

        </main>
      </div>
    </div>
  );
}