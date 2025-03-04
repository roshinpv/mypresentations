import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Network, 
  BookOpen, 
  BarChart3, 
  MessageSquare, 
  Settings,
  Shield
} from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white border-r border-neutral-lighter flex flex-col">
      <div className="p-6 border-b border-neutral-lighter">
        <div className="flex items-center">
          <Shield className="text-primary h-8 w-8" />
          <div className="ml-2">
            <h1 className="text-xl font-bold">RegulateAI</h1>
            <p className="text-xs text-neutral-light">Compliance Platform</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 rounded-md ${
                  isActive 
                    ? 'bg-primary text-white' 
                    : 'text-neutral hover:bg-neutral-lighter'
                }`
              }
            >
              <Home size={18} className="mr-3" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/graph" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 rounded-md ${
                  isActive 
                    ? 'bg-primary text-white' 
                    : 'text-neutral hover:bg-neutral-lighter'
                }`
              }
            >
              <Network size={18} className="mr-3" />
              <span>Knowledge Graph</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/regulations" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 rounded-md ${
                  isActive 
                    ? 'bg-primary text-white' 
                    : 'text-neutral hover:bg-neutral-lighter'
                }`
              }
            >
              <BookOpen size={18} className="mr-3" />
              <span>Regulations</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/impact" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 rounded-md ${
                  isActive 
                    ? 'bg-primary text-white' 
                    : 'text-neutral hover:bg-neutral-lighter'
                }`
              }
            >
              <BarChart3 size={18} className="mr-3" />
              <span>Impact Analysis</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/assistant" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 rounded-md ${
                  isActive 
                    ? 'bg-primary text-white' 
                    : 'text-neutral hover:bg-neutral-lighter'
                }`
              }
            >
              <MessageSquare size={18} className="mr-3" />
              <span>AI Assistant</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      
      <div className="p-4 border-t border-neutral-lighter">
        <NavLink 
          to="/settings" 
          className={({ isActive }) => 
            `flex items-center px-4 py-3 rounded-md ${
              isActive 
                ? 'bg-primary text-white' 
                : 'text-neutral hover:bg-neutral-lighter'
            }`
          }
        >
          <Settings size={18} className="mr-3" />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;