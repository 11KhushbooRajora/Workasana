const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const {initializeDb} = require("./db/db.connect");

const Task = require("./models/TaskModel");
const Team = require("./models/Team");
const Project = require("./models/Project");
const User = require("./models/User");
const Tag = require("./models/Tag");

const app = express();

app.use(cors());
app.use(express.json());

initializeDb();

const JWT_SECRET = "your_jwt_secret";


// ==================== AUTH ====================

// Signup
app.post("/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const user = new User({
      name,
      email,
      password,
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


// Login
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.json({
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


// Get current user
app.get("/auth/me", async (req, res) => {
  try {
    const user = await User.findById(req.query.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


// ==================== TEAMS ====================

// Create Team
app.post("/teams", async (req, res) => {
  try {
    const { name, description } = req.body;

    const team = new Team({
      name,
      description,
    });

    await team.save();

    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


// Get Teams
app.get("/teams", async (req, res) => {
  try {
    const teams = await Team.find();

    res.json(teams);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


// ==================== PROJECTS ====================

// Create Project
app.post("/projects", async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = new Project({
      name,
      description,
    });

    await project.save();

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


// Get Projects
app.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find();

    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


// ==================== TAGS ====================

// Create Tag
app.post("/tags", async (req, res) => {
  try {
    const { name } = req.body;

    const tag = new Tag({
      name,
    });

    await tag.save();

    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


// Get Tags
app.get("/tags", async (req, res) => {
  try {
    const tags = await Tag.find();

    res.json(tags);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


// ==================== USERS ====================

// Create User
app.post("/users", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = new User({
      name,
      email,
      password,
    });

    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


// Get Users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


// ==================== TASKS ====================

// Create Task
app.post("/tasks", async (req, res) => {
  try {
    const {
      name,
      project,
      team,
      owners,
      tags,
      timeToComplete,
      status,
    } = req.body;

    const task = new Task({
      name,
      project,
      team,
      owners,
      tags,
      timeToComplete,
      status,
    });

    await task.save();

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


// Get Tasks
app.get("/tasks", async (req, res) => {
  try {
    const { team, owner, tags, project, status } = req.query;

    let filter = {};

    if (team) {
      const teamData = await Team.findOne({
        name: team,
      });

      if (teamData) {
        filter.team = teamData._id;
      }
    }

    if (owner) {
      const userData = await User.findOne({
        name: owner,
      });

      if (userData) {
        filter.owners = userData._id;
      }
    }

    if (project) {
      const projectData = await Project.findOne({
        name: project,
      });

      if (projectData) {
        filter.project = projectData._id;
      }
    }

    if (tags) {
      const tagList = tags.split(",");

      filter.tags = {
        $in: tagList,
      };
    }

    if (status) {
      filter.status = status;
    }

    const tasks = await Task.find(filter);

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


// Get one Task
app.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


// Update Task
app.put("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


// Delete Task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


// ==================== REPORTS ====================

// Last Week Completed Tasks
app.get("/report/last-week", async (req, res) => {
  try {
    const date = new Date();

    date.setDate(date.getDate() - 7);

    const tasks = await Task.find({
      status: "Completed",
      updatedAt: {
        $gte: date,
      },
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


// Pending Tasks
app.get("/report/pending", async (req, res) => {
  try {
    const tasks = await Task.find({
      status: {
        $ne: "Completed",
      },
    });

    let totalTime = 0;

    tasks.forEach((task) => {
      totalTime = totalTime + task.timeToComplete;
    });

    res.json({
      pendingTasks: tasks.length,
      totalTimeToComplete: totalTime,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


// Closed Tasks
app.get("/report/closed-tasks", async (req, res) => {
  try {
    const tasks = await Task.find({
      status: "Completed",
    });

    let teamReport = {};
    let ownerReport = {};
    let projectReport = {};

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];

      const team = await Team.findById(task.team);

      if (team) {
        if (teamReport[team.name]) {
          teamReport[team.name] =
            teamReport[team.name] + 1;
        } else {
          teamReport[team.name] = 1;
        }
      }

      const project = await Project.findById(task.project);

      if (project) {
        if (projectReport[project.name]) {
          projectReport[project.name] =
            projectReport[project.name] + 1;
        } else {
          projectReport[project.name] = 1;
        }
      }

      for (let j = 0; j < task.owners.length; j++) {
        const user = await User.findById(task.owners[j]);

        if (user) {
          if (ownerReport[user.name]) {
            ownerReport[user.name] =
              ownerReport[user.name] + 1;
          } else {
            ownerReport[user.name] = 1;
          }
        }
      }
    }

    res.json({
      byTeam: teamReport,
      byOwner: ownerReport,
      byProject: projectReport,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


// ==================== SERVER ====================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});