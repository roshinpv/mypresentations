import React, { useState } from 'react';
import RegulationsList from '../components/Regulations/RegulationsList';
import RegulationDetail from '../components/Regulations/RegulationDetail';
import { regulations } from '../data/mockData';

const RegulationsPage: React.FC = () => {
  const [selectedRegulationId, setSelectedRegulationId] = useState<string | null>(null);
  
  const selectedRegulation = regulations.find(r => r.id === selectedRegulationId);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Regulations Explorer</h1>
        <div>
          <button className="btn btn-outline mr-2">Import Regulation</button>
          <button className="btn btn-primary">Add New Regulation</button>
        </div>
      </div>
      
      {selectedRegulation ? (
        <RegulationDetail 
          regulation={selectedRegulation} 
          onClose={() => setSelectedRegulationId(null)} 
        />
      ) : (
        <RegulationsList />
      )}
    </div>
  );
};

export default RegulationsPage;