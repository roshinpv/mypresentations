import React, { useState, useEffect } from 'react';
import { Calendar, Users, CheckSquare } from 'lucide-react';
import { regulationsAPI } from '../../api';
import { Regulation } from '../../types';

interface RegulationDetailProps {
  regulationId: string;
  onClose: () => void;
}

const RegulationDetail: React.FC<RegulationDetailProps> = ({ regulationId, onClose }) => {
  const [regulation, setRegulation] = useState<Regulation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegulation = async () => {
      try {
        const data = await regulationsAPI.getById(regulationId);
        setRegulation(data);
      } catch (err) {
        console.error('Error fetching regulation:', err);
        setError('Failed to load regulation details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegulation();
  }, [regulationId]);

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Loading...</h2>
          <button 
            className="text-neutral-light hover:text-neutral"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="py-8 text-center text-neutral-light">Loading regulation details...</div>
      </div>
    );
  }

  if (error || !regulation) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Error</h2>
          <button 
            className="text-neutral-light hover:text-neutral"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="py-8 text-center text-red-500">{error || 'Failed to load regulation'}</div>
      </div>
    );
  }

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
            <p className="font-medium">{new Date(regulation.last_updated).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-neutral-lighter mr-3">
            <Users size={16} className="text-neutral" />
          </div>
          <div>
            <p className="text-xs text-neutral-light">Issuing Agency</p>
            <p className="font-medium">{regulation.agency?.name || 'Unknown'}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className={`p-2 rounded-full mr-3 ${
            regulation.impact_level === 'High' ? 'bg-primary/10' : 
            regulation.impact_level === 'Medium' ? 'bg-secondary/20' : 'bg-neutral-lighter'
          }`}>
            <CheckSquare size={16} className={
              regulation.impact_level === 'High' ? 'text-primary' : 
              regulation.impact_level === 'Medium' ? 'text-secondary-dark' : 'text-neutral-light'
            } />
          </div>
          <div>
            <p className="text-xs text-neutral-light">Impact Level</p>
            <p className="font-medium">{regulation.impact_level}</p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Summary</h3>
        <p className="text-neutral-light">{regulation.summary}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Affected Banks</h3>
          {regulation.affected_banks && regulation.affected_banks.length > 0 ? (
            <ul className="space-y-2">
              {regulation.affected_banks.map((bank) => (
                <li key={bank.id} className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                  <span>{bank.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-neutral-light">No affected banks specified</p>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Compliance Steps</h3>
          {regulation.compliance_steps && regulation.compliance_steps.length > 0 ? (
            <ul className="space-y-2">
              {regulation.compliance_steps
                .sort((a, b) => a.order - b.order)
                .map((step, index) => (
                  <li key={step.id} className="flex items-start">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-neutral-lighter text-neutral flex items-center justify-center mr-2 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{step.description}</span>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-neutral-light">No compliance steps specified</p>
          )}
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