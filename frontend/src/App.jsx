
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import NewTask from "./pages/NewTask";
import TaskList from "./pages/TaskList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Onboarding />}
        />

        <Route
          path="/home"
          element={<Home />}
        />

        <Route
          path="/new-task"
          element={<NewTask />}
        />

        <Route
          path="/tasks"
          element={<TaskList />}
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
        <Route path="/tasks" element={<TaskList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
