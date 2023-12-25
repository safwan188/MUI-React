import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import theme from './theme';
import ExpertTablePage from './pages/tables/ExpertTablePage';
import ExpertFormPage from './pages/forms/ExpertFormPage';
import ReportTablePage from './pages/tables/ReportTablePage';
import NewReportPage from './pages/forms/NewReportPage';
import CustomerTablePage from './pages/tables/CustomerTablePage';
import LoginPage from './pages/forms/LoginPage';
import AddCustomerForm from './components/forms/AddCustomerForm';
import CustomerFormPage from './pages/forms/CustomerFormPage';
import ExpertRequestTablePage from './pages/tables/ExpertRequestTablePage';
import ReportEditPage from './components/forms/ReportEditForm';
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [rtlPlugin]
});

function App() {
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/reportedit/:reportId" element={<ReportEditPage />} />
            <Route path="/expertrequests" element={<ExpertRequestTablePage />} />
            <Route path="/add-customer" element={<CustomerFormPage />} />
            <Route path="/" element={<LoginPage />} />
            <Route path="/customers" element={<CustomerTablePage />} />
            <Route path="/reports" element={<ReportTablePage />} />
            <Route path="/experts" element={<ExpertTablePage />} />
            <Route path="/add-report" element={<NewReportPage />} />
            <Route path="/add-expert" element={<ExpertFormPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;
