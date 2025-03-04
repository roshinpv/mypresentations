import React, { useState } from 'react';
import { regulations } from '../../data/mockData';
import { Search, Filter } from 'lucide-react';

const RegulationsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories = ['All', 'Risk', 'Capital', 'Consumer Protection', 'Fraud'];
  
  const filteredRegulations = regulations.filter((reg) => {
    const matchesSearch = reg.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         reg.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || !selectedCategory || reg.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Regulations Explorer</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search regulations..."
              className="input pl-10 py-1 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-light" size={16} />
          </div>
          <div className="relative">
            <button className="btn btn-outline py-1 flex items-center">
              <Filter size={16} className="mr-2" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategory === category || (category === 'All' && !selectedCategory)
                ? 'bg-primary text-white'
                : 'bg-neutral-lighter text-neutral-light hover:bg-neutral-light hover:text-white'
            }`}
            onClick={() => setSelectedCategory(category === 'All' ? null : category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-lighter">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-light uppercase tracking-wider">Regulation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-light uppercase tracking-wider">Agency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-light uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-light uppercase tracking-wider">Impact Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-light uppercase tracking-wider">Last Updated</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-light uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-lighter">
            {filteredRegulations.map((regulation) => (
              <tr key={regulation.id} className="hover:bg-background">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium">{regulation.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm">{regulation.agency}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm">{regulation.category}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`badge ${
                    regulation.impactLevel === 'High' ? 'badge-high' : 
                    regulation.impactLevel === 'Medium' ? 'badge-medium' : 'badge-low'
                  }`}>
                    {regulation.impactLevel}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-light">
                  {new Date(regulation.lastUpdated).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button className="text-primary hover:text-primary-dark font-medium">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegulationsList;