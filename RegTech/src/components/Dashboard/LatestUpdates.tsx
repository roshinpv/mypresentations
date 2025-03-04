import React from 'react';
import { regulatoryUpdates } from '../../data/mockData';
import { Clock } from 'lucide-react';

const LatestUpdates: React.FC = () => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Latest Regulatory Updates</h2>
        <button className="btn btn-outline text-sm">View All</button>
      </div>
      
      <div className="space-y-4">
        {regulatoryUpdates.slice(0, 3).map((update) => (
          <div key={update.id} className="border-b border-neutral-lighter pb-4 last:border-0 last:pb-0">
            <div className="flex items-start">
              <div className="flex-1">
                <h3 className="font-medium">{update.title}</h3>
                <p className="text-sm text-neutral-light mt-1">{update.description}</p>
                <div className="flex items-center mt-2">
                  <span className="text-xs font-medium bg-neutral-lighter text-neutral-light px-2 py-1 rounded-full">
                    {update.agency}
                  </span>
                  <div className="flex items-center ml-3 text-xs text-neutral-light">
                    <Clock size={12} className="mr-1" />
                    {new Date(update.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestUpdates;