import React, { useState } from 'react';
import { Search, Bell, User } from 'lucide-react';
import { complianceAlerts } from '../data/mockData';

const Header: React.FC = () => {
  const [query, setQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Searching for:', query);
  };
  
  return (
    <header className="bg-white border-b border-neutral-lighter px-6 py-4">
      <div className="flex items-center justify-between">
        <form onSubmit={handleSearch} className="w-1/2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search regulations in plain English..."
              className="input pl-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-light" size={18} />
          </div>
        </form>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button 
              className="p-2 rounded-full hover:bg-neutral-lighter relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} className="text-neutral" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-primary rounded-full text-white text-xs flex items-center justify-center">
                {complianceAlerts.length}
              </span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-10 py-2">
                <div className="px-4 py-2 border-b border-neutral-lighter">
                  <h3 className="font-semibold">Compliance Alerts</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {complianceAlerts.map((alert) => (
                    <div key={alert.id} className="px-4 py-3 hover:bg-background border-b border-neutral-lighter last:border-0">
                      <div className="flex items-start">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{alert.title}</p>
                          <p className="text-xs text-neutral-light mt-1">{alert.description}</p>
                          <div className="flex items-center mt-2">
                            <span className={`badge ${
                              alert.priority === 'High' ? 'badge-high' : 
                              alert.priority === 'Medium' ? 'badge-medium' : 'badge-low'
                            }`}>
                              {alert.priority}
                            </span>
                            <span className="text-xs text-neutral-light ml-2">Due: {new Date(alert.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
              <User size={16} />
            </div>
            <span className="ml-2 font-medium">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;