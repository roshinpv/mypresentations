import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import GraphView from './pages/GraphView';
import RegulationsPage from './pages/RegulationsPage';
import ImpactPage from './pages/ImpactPage';
import AssistantPage from './pages/AssistantPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="graph" element={<GraphView />} />
          <Route path="regulations" element={<RegulationsPage />} />
          <Route path="impact" element={<ImpactPage />} />
          <Route path="assistant" element={<AssistantPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;