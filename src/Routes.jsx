import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import NotFound from "pages/NotFound";
import Authentication from './pages/authentication';
import MainChatInterface from './pages/main-chat-interface';
import UserProfileSettings from './pages/user-profile-settings';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <ScrollToTop />
          <RouterRoutes>
            {/* Define your route here */}
            <Route path="/" element={<Authentication />} />
            <Route path="/authentication" element={<Authentication />} />
            <Route path="/main-chat-interface" element={<MainChatInterface />} />
            <Route path="/user-profile-settings" element={<UserProfileSettings />} />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
