import React from 'react';
import { Settings, Upload, Database, RefreshCw, Bell, Shield } from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-neutral-lighter mr-4">
              <Upload size={20} className="text-neutral" />
            </div>
            <h2 className="text-lg font-semibold">Upload Regulations</h2>
          </div>
          <p className="text-neutral-light mb-4">
            Upload new regulatory documents to be processed and added to the knowledge base.
          </p>
          <button className="btn btn-primary w-full">Upload Documents</button>
        </div>
        
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-neutral-lighter mr-4">
              <Database size={20} className="text-neutral" />
            </div>
            <h2 className="text-lg font-semibold">Knowledge Base</h2>
          </div>
          <p className="text-neutral-light mb-4">
            Manage the regulatory knowledge base and update existing regulations.
          </p>
          <button className="btn btn-primary w-full">Manage Knowledge Base</button>
        </div>
        
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-neutral-lighter mr-4">
              <RefreshCw size={20} className="text-neutral" />
            </div>
            <h2 className="text-lg font-semibold">Train AI Model</h2>
          </div>
          <p className="text-neutral-light mb-4">
            Fine-tune the Llama 3.2 6B model with the latest regulatory data.
          </p>
          <button className="btn btn-primary w-full">Start Training</button>
        </div>
        
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-neutral-lighter mr-4">
              <Bell size={20} className="text-neutral" />
            </div>
            <h2 className="text-lg font-semibold">Notification Settings</h2>
          </div>
          <p className="text-neutral-light mb-4">
            Configure how and when you receive regulatory update notifications.
          </p>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span>Email Notifications</span>
              <input type="checkbox" defaultChecked />
            </label>
            <label className="flex items-center justify-between">
              <span>Push Notifications</span>
              <input type="checkbox" defaultChecked />
            </label>
            <label className="flex items-center justify-between">
              <span>Daily Digest</span>
              <input type="checkbox" />
            </label>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-neutral-lighter mr-4">
              <Shield size={20} className="text-neutral" />
            </div>
            <h2 className="text-lg font-semibold">Security Settings</h2>
          </div>
          <p className="text-neutral-light mb-4">
            Manage access controls and security settings for the platform.
          </p>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span>Two-Factor Authentication</span>
              <input type="checkbox" defaultChecked />
            </label>
            <label className="flex items-center justify-between">
              <span>API Access</span>
              <input type="checkbox" />
            </label>
            <label className="flex items-center justify-between">
              <span>Session Timeout (minutes)</span>
              <select className="input w-24 py-1">
                <option>15</option>
                <option>30</option>
                <option>60</option>
              </select>
            </label>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-neutral-lighter mr-4">
              <Settings size={20} className="text-neutral" />
            </div>
            <h2 className="text-lg font-semibold">General Settings</h2>
          </div>
          <p className="text-neutral-light mb-4">
            Configure general platform settings and preferences.
          </p>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span>Dark Mode</span>
              <input type="checkbox" />
            </label>
            <label className="flex items-center justify-between">
              <span>Language</span>
              <select className="input w-24 py-1">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </label>
            <label className="flex items-center justify-between">
              <span>Auto-refresh Data</span>
              <input type="checkbox" defaultChecked />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;