import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export function DashboardCharts({ papers, totalCount }) {
  if (!papers || papers.length === 0) return null;

  // Year breakdown
  const yearCounts = papers.reduce((acc, paper) => {
    const yr = paper.publicationYear;
    if (yr && yr !== 'N/A') {
      acc[yr] = (acc[yr] || 0) + 1;
    }
    return acc;
  }, {});

  const yearData = Object.keys(yearCounts)
    .sort((a, b) => Number(a) - Number(b))
    .map((year) => ({
      year: String(year),
      count: yearCounts[year]
    }));

  // Open Access vs Closed
  const oaCount = papers.filter((p) => p.openAccess).length;
  const closedCount = papers.length - oaCount;
  const accessData = [
    { name: 'Open Access', value: oaCount, color: '#10b981' },
    { name: 'Restricted', value: closedCount, color: '#64748b' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* Metric Card */}
      <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
        <div>
          <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
            Current Query Scope
          </h4>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {totalCount.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Total indexed papers found matching this topic.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
            <span>Sampled on this page:</span>
            <span className="font-bold">{papers.length}</span>
          </div>
          <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mt-1">
            <span>Open Access on page:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{oaCount}</span>
          </div>
        </div>
      </div>

      {/* Year Distribution Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
        <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 mb-4">
          Publication Year Spread
        </h4>
        <div className="h-36 sm:h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={yearData}>
              <XAxis dataKey="year" fontSize={11} tickLine={false} axisLine={false} stroke="#94a3b8" />
              <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="#94a3b8" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Access Type Pie Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
        <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 mb-4">
          Access Availability
        </h4>
        <div className="h-36 sm:h-44 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={accessData}
                innerRadius={45}
                outerRadius={65}
                paddingAngle={4}
                dataKey="value"
              >
                {accessData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}