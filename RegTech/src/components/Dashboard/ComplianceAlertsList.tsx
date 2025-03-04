import React from 'react';
import { complianceAlerts } from '../../data/mockData';
import { AlertTriangle, Calendar } from 'lucide-react';

const ComplianceAlertsList: React.FC = () => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Compliance Alerts</h2>
        <button className="btn btn-outline text-sm">View All</button>
      </div>
      
      <div className="space-y-4">
        {complianceAlerts.slice(0, 3).map((alert) => (
          <div key={alert.id} className="flex items-start border-b border-neutral-lighter pb-4 last:border-0 last:pb-0">
            <div className={`p-2 rounded-full mr-3 ${
              alert.priority === 'High' ? 'bg-primary/10' : 
              alert.priority === 'Medium' ? 'bg-secondary/20' : 'bg-neutral-lighter'
            }`}>
              <AlertTriangle size={16} className={
                alert.priority === 'High' ? 'text-primary' : 
                alert.priority === 'Medium' ? 'text-secondary-dark' : 'text-neutral-light'
              } />
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium">{alert.title}</h3>
              <p className="text-sm text-neutral-light mt-1">{alert.description}</p>
              <div className="flex items-center mt-2">
                <span className={`badge ${
                  alert.priority === 'High' ? 'badge-high' : 
                  alert.priority === 'Medium' ? 'badge-medium' : 'badge-low'
                }`}>
                  {alert.priority}
                </span>
                <div className="flex items-center ml-3 text-xs text-neutral-light">
                  <Calendar size={12} className="mr-1" />
                  Due: {new Date(alert.dueDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplianceAlertsList;