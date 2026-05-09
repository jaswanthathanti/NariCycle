import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', score: 65, symptoms: 3 },
  { name: 'Tue', score: 70, symptoms: 2 },
  { name: 'Wed', score: 68, symptoms: 2 },
  { name: 'Thu', score: 75, symptoms: 1 },
  { name: 'Fri', score: 82, symptoms: 0 },
  { name: 'Sat', score: 85, symptoms: 0 },
  { name: 'Sun', score: 85, symptoms: 0 },
];

const HealthTrends = () => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-slate-900">Health Insights</h2>
          <p className="text-sm text-slate-500">Your health score over the last 7 days</p>
        </div>
        <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2 outline-none">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="h-72 w-full min-h-[250px]">
        <ResponsiveContainer width="99%" height="100%" minHeight={250}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke="#10b981" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorScore)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HealthTrends;
