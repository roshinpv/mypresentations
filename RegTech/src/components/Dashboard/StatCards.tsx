import React from 'react';
import { AlertTriangle, BookOpen, Clock, BarChart3 } from 'lucide-react';

const StatCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="card">
        <div className="flex items-start">
          <div className="p-3 rounded-full bg-primary/10 mr-4">
            <AlertTriangle size={20} className="text-primary" />
          </div>
          <div>
            <p className="text-neutral-light text-sm">Pending Alerts</p>
            <h3 className="text-2xl font-bold mt-1">5</h3>
            <p className="text-xs text-primary mt-1">2 high priority</p>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="flex items-start">
          <div className="p-3 rounded-full bg-secondary/20 mr-4">
            <BookOpen size={20} className="text-secondary-dark" />
          </div>
          <div>
            <p className="text-neutral-light text-sm">Active Regulations</p>
            <h3 className="text-2xl font-bold mt-1">42</h3>
            <p className="text-xs text-neutral-light mt-1">+3 from last month</p>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="flex items-start">
          <div className="p-3 rounded-full bg-neutral-lighter mr-4">
            <Clock size={20} className="text-neutral" />
          </div>
          <div>
            <p className="text-neutral-light text-sm">Recent Updates</p>
            <h3 className="text-2xl font-bold mt-1">12</h3>
            <p className="text-xs text-neutral-light mt-1">Last 30 days</p>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="flex items-start">
          <div className="p-3 rounded-full bg-primary/10 mr-4">
            <BarChart3 size={20} className="text-primary" />
          </div>
          <div>
            <p className="text-neutral-light text-sm">Compliance Score</p>
            <h3 className="text-2xl font-bold mt-1">92%</h3>
            <p className="text-xs text-green-600 mt-1">↑ 4% from last quarter</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCards;