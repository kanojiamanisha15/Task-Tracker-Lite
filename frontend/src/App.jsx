import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { ROUTES } from "./utils/constants";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCategories from "./pages/AdminCategories";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Layout>
                    <Navigate to={ROUTES.DASHBOARD} replace />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.TASKS}
              element={
                <ProtectedRoute>
                  <Layout>
                    <Tasks />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path={ROUTES.ADMIN_DASHBOARD}
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.ADMIN_CATEGORIES}
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Layout>
                    <AdminCategories />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Catch all route */}
            <Route
              path="*"
              element={<Navigate to={ROUTES.DASHBOARD} replace />}
            />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
