import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

import Layout from './Components/Layout';
import ArticlesList from './Pages/MainPage';
import ArticlePage from './Pages/ArticlePage';
import SignUp from './Pages/SignUp';
import SignIn from './Pages/SignIn';
import Settings from './Pages/SettingsPage';
import NewPost from './Pages/NewPost';
import EditArticle from './Pages/EditPage';

import useAuthStore from './Store/AuthStore';
import { getCurrentUser } from './Api/Auth';
import { ProtectedRoute, ProtectedAuthRoute } from './Components/ProtectedRoutes';

function App() {
  const token = useAuthStore((s) => s.token);
  const hydrate = useAuthStore((s) => s.hydrate);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!token) return;

    getCurrentUser(token)
      .then(({ data }) => hydrate(data.user))
      .catch(logout);
  }, [token, hydrate, logout]);

  return (
    <BrowserRouter>
      <Routes>

        {/* layout */}
        <Route element={<Layout />}>

          {/* главная */}
          <Route index element={<ArticlesList />} />

          {/* вложенные articles */}
          <Route path="articles">
            <Route index element={<ArticlesList />} />
            <Route path=":slug" element={<ArticlePage />} />
          </Route>

          {/* новый пост */}
          <Route
            path="new-article"
            element={
              <ProtectedRoute>
                <NewPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="articles/:slug/edit"
            element={
              <ProtectedRoute>
                <EditArticle />
              </ProtectedRoute>
            }
          />

          {/* защищённая страница */}
          <Route
            path="settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* только для не авторизованных */}
          <Route
            path="sign-in"
            element={
              <ProtectedAuthRoute>
                <SignIn />
              </ProtectedAuthRoute>
            }
          />

          <Route
            path="sign-up"
            element={
              <ProtectedAuthRoute>
                <SignUp />
              </ProtectedAuthRoute>
            }
          />

        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;