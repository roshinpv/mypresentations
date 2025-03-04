import React from 'react';
import StatCards from '../components/Dashboard/StatCards';
import LatestUpdates from '../components/Dashboard/LatestUpdates';
import ComplianceAlertsList from '../components/Dashboard/ComplianceAlertsList';
import GraphVisualization from '../components/Graph/GraphVisualization';
import { graphData } from '../data/mockData';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div>
          <button className="btn btn-primary">Generate Compliance Report</button>
        </div>
      </div>
      
      <StatCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LatestUpdates />
        <ComplianceAlertsList />
      </div>
      
      <GraphVisualization data={graphData} />
    </div>
  );
};

export default Dashboard;