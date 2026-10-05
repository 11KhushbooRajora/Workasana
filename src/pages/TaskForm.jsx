import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

export default function TaskForm() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [tags, setTags] = useState([]);

  const [form, setForm] = useState({
    name: "",
    project: "",
    team: "",
    owners: [],
    tags: [],
    timeToComplete: "",
    status: "To Do",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [
        projectsResponse,
        teamsResponse,
        usersResponse,
        tagsResponse,
      ] = await Promise.all([
        fetch(`${API}/projects`),
        fetch(`${API}/teams`),
        fetch(`${API}/users`),
        fetch(`${API}/tags`),
      ]);

      setProjects(await projectsResponse.json());
      setTeams(await teamsResponse.json());
      setUsers(await usersResponse.json());
      setTags(await tagsResponse.json());
    } catch (error) {
      setError("Unable to load task form data.");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  function handleMultiSelect(e) {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    setForm({
      ...form,
      [e.target.name]: values,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          project: form.project,
          team: form.team,
          owners: form.owners,
          tags: form.tags,
          timeToComplete: Number(form.timeToComplete),
          status: form.status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to create task.");
        return;
      }

      navigate("/dashboard");
    } catch (error) {
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">

          <div className="card shadow-sm">
            <div className="card-body p-4">

              <h2 className="mb-4">Create New Task</h2>

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>

                {/* Task Name */}
                <div className="mb-3">
                  <label className="form-label">
                    Task Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter task name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Project */}
                <div className="mb-3">
                  <label className="form-label">
                    Project Name
                  </label>

                  <select
                    name="project"
                    className="form-select"
                    value={form.project}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select Project
                    </option>

                    {projects.map((project) => (
                      <option
                        key={project._id}
                        value={project._id}
                      >
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Owners */}
                <div className="mb-3">
                  <label className="form-label">
                    Owners (Team Members)
                  </label>

                  <select
                    name="owners"
                    className="form-select"
                    multiple
                    value={form.owners}
                    onChange={handleMultiSelect}
                    required
                  >
                    {users.map((user) => (
                      <option
                        key={user._id}
                        value={user._id}
                      >
                        {user.name}
                      </option>
                    ))}
                  </select>

                  <small className="text-muted">
                    Hold Ctrl/Cmd to select multiple members.
                  </small>
                </div>

                {/* Team */}
                <div className="mb-3">
                  <label className="form-label">
                    Team
                  </label>

                  <select
                    name="team"
                    className="form-select"
                    value={form.team}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select Team
                    </option>

                    {teams.map((team) => (
                      <option
                        key={team._id}
                        value={team._id}
                      >
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div className="mb-3">
                  <label className="form-label">
                    Tags
                  </label>

                  <select
                    name="tags"
                    className="form-select"
                    multiple
                    value={form.tags}
                    onChange={handleMultiSelect}
                  >
                    {tags.map((tag) => (
                      <option
                        key={tag._id}
                        value={tag.name}
                      >
                        {tag.name}
                      </option>
                    ))}
                  </select>

                  <small className="text-muted">
                    Hold Ctrl/Cmd to select multiple tags.
                  </small>
                </div>

                {/* Time to Complete */}
                <div className="mb-3">
                  <label className="form-label">
                    Time to Complete (days)
                  </label>

                  <input
                    type="number"
                    name="timeToComplete"
                    className="form-control"
                    min="1"
                    placeholder="Enter number of days"
                    value={form.timeToComplete}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Status */}
                <div className="mb-4">
                  <label className="form-label">
                    Status
                  </label>

                  <select
                    name="status"
                    className="form-select"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">
                      In Progress
                    </option>
                    <option value="Completed">
                      Completed
                    </option>
                    <option value="Blocked">
                      Blocked
                    </option>
                  </select>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn btn-dark"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Task"}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary ms-2"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </button>

              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}