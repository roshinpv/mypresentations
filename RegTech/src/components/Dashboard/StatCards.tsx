import React, { useState, useEffect } from 'react';
import { AlertTriangle, BookOpen, Clock, BarChart3 } from 'lucide-react';
import { alertsAPI, regulationsAPI, updatesAPI } from '../../api';

const StatCards: React.FC = () => {
  const [stats, setStats] = useState({
    pendingAlerts: 0,
    highPriorityAlerts: 0,
    activeRegulations: 0,
    newRegulations: 0,
    recentUpdates: 0,
    complianceScore: 92 // This would typically come from a more complex calculation
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch alerts
        const alerts = await alertsAPI.getUpcoming(30);
        const highPriorityAlerts = alerts.filter(alert => alert.priority === 'High').length;
        
        // Fetch regulations
        const regulations = await regulationsAPI.getAll();
        
        // Fetch updates
        const updates = await updatesAPI.getRecent(30);
        
        setStats({
          pendingAlerts: alerts.length,
          highPriorityAlerts,
          activeRegulations: regulations.length,
          newRegulations: 3, // This would typically be calculated based on a time period
          recentUpdates: updates.length,
          complianceScore: 92
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card">
            <div className="animate-pulse flex items-start">
              <div className="rounded-full bg-neutral-lighter h-12 w-12 mr-4"></div>
              <div className="flex-1">
                <div className="h-4 bg-neutral-lighter rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-neutral-lighter rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-neutral-lighter rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="card">
        <div className="flex items-start">
          <div className="p-3 rounded-full bg-primary/10 mr-4">
            <AlertTriangle size={20} className="text-primary" />
          </div>
          <div>
            <p className="text-neutral-light text-sm">Pending Alerts</p>
            <h3 className="text-2xl font-bold mt-1">{stats.pendingAlerts}</h3>
            <p className="text-xs text-primary mt-1">{stats.highPriorityAlerts} high priority</p>
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
            <h3 className="text-2xl font-bold mt-1">{stats.activeRegulations}</h3>
            <p className="text-xs text-neutral-light mt-1">+{stats.newRegulations} from last month</p>
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
            <h3 className="text-2xl font-bold mt-1">{stats.recentUpdates}</h3>
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
            <h3 className="text-2xl font-bold mt-1">{stats.complianceScore}%</h3>
            <p className="text-xs text-green-600 mt-1">↑ 4% from last quarter</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCards;