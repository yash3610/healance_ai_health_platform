import React from 'react';
import CombinedReport from './CombinedReport';

// Unified report entry point. Accepts both the latest/selected heart and
// symptoms predictions and renders a single combined PDF containing both.
const ReportDocument = ({ heartPrediction, symptomsPrediction, user }) => (
  <CombinedReport
    heartPrediction={heartPrediction || null}
    symptomsPrediction={symptomsPrediction || null}
    user={user || {}}
  />
);

// Generate a friendly filename for the combined report download
export const getReportFilename = (user) => {
  const firstName = String(user?.name || 'patient')
    .trim()
    .split(/\s+/)[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
  const date = new Date().toISOString().slice(0, 10);
  return `healance-health-report-${firstName || 'patient'}-${date}.pdf`;
};

export default ReportDocument;
