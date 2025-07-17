import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Layout from "./assets/components/layout/Layout";
import { routes } from "./assets/config/routes";

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element}>
                {route.children?.map((child, childIndex) => (
                  <Route
                    key={childIndex}
                    path={child.path}
                    element={child.element}
                  />
                ))}
              </Route>
            ))}
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
