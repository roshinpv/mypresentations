import React, { useState } from 'react';
import { regulations, banks } from '../../data/mockData';
import { BarChart3, ArrowRight } from 'lucide-react';

const ImpactAnalysis: React.FC = () => {
  const [selectedBank, setSelectedBank] = useState('bank-003'); // Default to Wells Fargo
  const [selectedRegulation, setSelectedRegulation] = useState('');
  
  const bank = banks.find(b => b.id === selectedBank);
  const affectedRegulations = regulations.filter(r => 
    bank?.affectedRegulations.includes(r.id)
  );
  
  const regulation = regulations.find(r => r.id === selectedRegulation);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Select Institution</h2>
          
          <div className="space-y-2">
            {banks.map((b) => (
              <button
                key={b.id}
                className={`w-full text-left px-4 py-3 rounded-md flex items-center ${
                  selectedBank === b.id 
                    ? 'bg-primary text-white' 
                    : 'bg-neutral-lighter hover:bg-neutral-light hover:text-white'
                }`}
                onClick={() => setSelectedBank(b.id)}
              >
                <span className="flex-1">{b.name}</span>
                {selectedBank === b.id && <ArrowRight size={16} />}
              </button>
            ))}
          </div>
          
          {bank && (
            <div className="mt-6 pt-6 border-t border-neutral-lighter">
              <h3 className="font-medium mb-2">Affected Regulations</h3>
              <p className="text-sm text-neutral-light mb-4">
                {bank.name} is affected by {affectedRegulations.length} regulations.
              </p>
              
              <div className="space-y-2">
                {affectedRegulations.map((reg) => (
                  <button
                    key={reg.id}
                    className={`w-full text-left px-4 py-3 rounded-md flex items-center justify-between ${
                      selectedRegulation === reg.id 
                        ? 'bg-primary/10 text-primary border border-primary/30' 
                        : 'bg-neutral-lighter hover:bg-neutral-light hover:text-white'
                    }`}
                    onClick={() => setSelectedRegulation(reg.id)}
                  >
                    <div>
                      <span className="font-medium">{reg.title}</span>
                      <p className="text-xs text-neutral-light mt-1">{reg.agency}</p>
                    </div>
                    <span className={`badge ${
                      reg.impactLevel === 'High' ? 'badge-high' : 
                      reg.impactLevel === 'Medium' ? 'badge-medium' : 'badge-low'
                    }`}>
                      {reg.impactLevel}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="lg:col-span-2">
        {regulation ? (
          <div className="card">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-primary/10 mr-4">
                <BarChart3 size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{regulation.title} Impact Analysis</h2>
                <p className="text-sm text-neutral-light">
                  How {regulation.title} affects {bank?.name}
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Summary</h3>
              <p className="text-neutral-light">{regulation.summary}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-neutral-lighter rounded-lg p-4">
                <h4 className="font-medium mb-2">Risk Level</h4>
                <div className={`text-lg font-bold ${
                  regulation.impactLevel === 'High' ? 'text-primary' : 
                  regulation.impactLevel === 'Medium' ? 'text-secondary-dark' : 'text-neutral'
                }`}>
                  {regulation.impactLevel}
                </div>
                <p className="text-xs text-neutral-light mt-1">
                  Based on institutional exposure
                </p>
              </div>
              
              <div className="bg-neutral-lighter rounded-lg p-4">
                <h4 className="font-medium mb-2">Compliance Deadline</h4>
                <div className="text-lg font-bold">
                  June 30, 2024
                </div>
                <p className="text-xs text-neutral-light mt-1">
                  45 days remaining
                </p>
              </div>
              
              <div className="bg-neutral-lighter rounded-lg p-4">
                <h4 className="font-medium mb-2">Readiness Score</h4>
                <div className="text-lg font-bold text-green-600">
                  78%
                </div>
                <p className="text-xs text-neutral-light mt-1">
                  Based on completed compliance steps
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Compliance Checklist</h3>
              <div className="space-y-3">
                {regulation.complianceSteps.map((step, index) => (
                  <div key={index} className="flex items-start">
                    <input 
                      type="checkbox" 
                      id={`step-${index}`} 
                      className="mt-1 mr-3"
                      defaultChecked={index < 3}
                    />
                    <label htmlFor={`step-${index}`} className="flex-1">
                      <span className="font-medium">{step}</span>
                      <p className="text-xs text-neutral-light mt-1">
                        {index < 3 ? 'Completed on May 15, 2024' : 'Due by June 30, 2024'}
                      </p>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Affected Policies</h3>
              <ul className="space-y-2">
                <li className="flex items-center justify-between p-3 bg-neutral-lighter rounded-md">
                  <span>Capital Adequacy Policy</span>
                  <button className="text-primary text-sm font-medium">View</button>
                </li>
                <li className="flex items-center justify-between p-3 bg-neutral-lighter rounded-md">
                  <span>Liquidity Risk Management</span>
                  <button className="text-primary text-sm font-medium">View</button>
                </li>
                <li className="flex items-center justify-between p-3 bg-neutral-lighter rounded-md">
                  <span>Stress Testing Framework</span>
                  <button className="text-primary text-sm font-medium">View</button>
                </li>
              </ul>
            </div>
            
            <div className="mt-6 pt-6 border-t border-neutral-lighter flex justify-end">
              <button className="btn btn-outline mr-2">Export Analysis</button>
              <button className="btn btn-primary">Generate Compliance Plan</button>
            </div>
          </div>
        ) : (
          <div className="card flex flex-col items-center justify-center h-full">
            <BarChart3 size={48} className="text-neutral-light mb-4" />
            <h3 className="text-lg font-medium">Select a Regulation</h3>
            <p className="text-neutral-light text-center mt-2">
              Choose a regulation from the list to view its impact analysis on {bank?.name}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImpactAnalysis;