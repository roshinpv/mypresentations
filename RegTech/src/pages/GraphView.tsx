import React, { useState } from 'react';
import GraphVisualization from '../components/Graph/GraphVisualization';
import { graphData } from '../data/mockData';
import { Network, Filter, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

const GraphView: React.FC = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [nodeTypes, setNodeTypes] = useState({
    regulation: true,
    agency: true,
    bank: true
  });
  
  const filteredData = {
    nodes: graphData.nodes.filter(node => nodeTypes[node.type]),
    links: graphData.links.filter(link => {
      const sourceNode = graphData.nodes.find(n => n.id === link.source);
      const targetNode = graphData.nodes.find(n => n.id === link.target);
      
      return sourceNode && targetNode && 
             nodeTypes[sourceNode.type] && 
             nodeTypes[targetNode.type];
    })
  };
  
  const handleNodeTypeToggle = (type: 'regulation' | 'agency' | 'bank') => {
    setNodeTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold">Knowledge Graph</h1>
          <p className="text-neutral-light">Visualize relationships between regulations, agencies, and banks</p>
        </div>
        <div className="flex space-x-2">
          <button 
            className="btn btn-outline flex items-center"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Filter size={16} className="mr-2" />
            <span>Filter</span>
          </button>
          <button className="btn btn-outline p-2">
            <ZoomIn size={20} />
          </button>
          <button className="btn btn-outline p-2">
            <ZoomOut size={20} />
          </button>
          <button className="btn btn-outline p-2">
            <RefreshCw size={20} />
          </button>
        </div>
      </div>
      
      {filterOpen && (
        <div className="card mb-4">
          <h3 className="font-medium mb-3">Filter Graph</h3>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                checked={nodeTypes.regulation}
                onChange={() => handleNodeTypeToggle('regulation')}
              />
              <span className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                Regulations
              </span>
            </label>
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                checked={nodeTypes.agency}
                onChange={() => handleNodeTypeToggle('agency')}
              />
              <span className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-orange-500 mr-1"></span>
                Agencies
              </span>
            </label>
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                checked={nodeTypes.bank}
                onChange={() => handleNodeTypeToggle('bank')}
              />
              <span className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
                Banks
              </span>
            </label>
          </div>
        </div>
      )}
      
      <div className="card">
        <div className="flex items-center mb-4">
          <div className="p-3 rounded-full bg-neutral-lighter mr-4">
            <Network size={20} className="text-neutral" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Regulatory Knowledge Graph</h2>
            <p className="text-sm text-neutral-light">
              Showing {filteredData.nodes.length} nodes and {filteredData.links.length} connections
            </p>
          </div>
        </div>
        
        <div className="border border-neutral-lighter rounded-lg overflow-hidden">
          <GraphVisualization data={filteredData} height={700} />
        </div>
        
        <div className="mt-4 text-sm text-neutral-light">
          <p>Tip: Click and drag nodes to rearrange the graph. Zoom in/out using the buttons above.</p>
        </div>
      </div>
    </div>
  );
};

export default GraphView;