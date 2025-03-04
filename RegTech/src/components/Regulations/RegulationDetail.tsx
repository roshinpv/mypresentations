import React from 'react';
import { Regulation } from '../../types';
import { Calendar, Users, CheckSquare } from 'lucide-react';

interface RegulationDetailProps {
  regulation: Regulation;
  onClose: () => void;
}

const RegulationDetail: React.FC<RegulationDetailProps> = ({ regulation, onClose }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">{regulation.title}</h2>
        <button 
          className="text-neutral-light hover:text-neutral"
          onClick={onClose}
        >
          Close
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-neutral-lighter mr-3">
            <Calendar size={16} className="text-neutral" />
          </div>
          <div>
            <p className="text-xs text-neutral-light">Last Updated</p>
            <p className="font-medium">{new Date(regulation.lastUpdated).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-neutral-lighter mr-3">
            <Users size={16} className="text-neutral" />
          </div>
          <div>
            <p className="text-xs text-neutral-light">Issuing Agency</p>
            <p className="font-medium">{regulation.agency}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className={`p-2 rounded-full mr-3 ${
            regulation.impactLevel === 'High' ? 'bg-primary/10' : 
            regulation.impactLevel === 'Medium' ? 'bg-secondary/20' : 'bg-neutral-lighter'
          }`}>
            <CheckSquare size={16} className={
              regulation.impactLevel === 'High' ? 'text-primary' : 
              regulation.impactLevel === 'Medium' ? 'text-secondary-dark' : 'text-neutral-light'
            } />
          </div>
          <div>
            <p className="text-xs text-neutral-light">Impact Level</p>
            <p className="font-medium">{regulation.impactLevel}</p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Summary</h3>
        <p className="text-neutral-light">{regulation.summary}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Affected Entities</h3>
          <ul className="space-y-2">
            {regulation.affectedEntities.map((entity, index) => (
              <li key={index} className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                <span>{entity}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Compliance Steps</h3>
          <ul className="space-y-2">
            {regulation.complianceSteps.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-neutral-lighter text-neutral flex items-center justify-center mr-2 mt-0.5">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-neutral-lighter flex justify-end">
        <button className="btn btn-outline mr-2">Export PDF</button>
        <button className="btn btn-primary">Generate Compliance Report</button>
      </div>
    </div>
  );
};

export default RegulationDetail;