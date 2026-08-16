import React from 'react';
import { Server, Layout, Database, CheckCircle2 } from 'lucide-react';

export function About() {
  const technicalCompetencies = [
    'REST API Architecture and Design',
    'Third-Party API Integration (OpenAlex)',
    'Asynchronous Request Management & Error Handling',
    'Data Transformation & Abstract Index Parsing',
    'Clean React Modular Component Architecture',
    'Data Visualization with Recharts',
    'Client-Side Persistence via localStorage',
    'Responsive & Accessible UI with Tailwind CSS'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          About This Project
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Technical specifications, architecture details, and skills demonstration.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 mb-8 space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Project Overview</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          The <strong>Research Paper Finder</strong> application demonstrates an enterprise-grade full-stack paradigm where a client frontend interacts directly with an Express middleware backend proxy rather than directly polling third-party resources. The backend executes payload sanitization, parses complex inverted-index abstracts, and delivers normalized payloads to the React presentation tier.
        </p>

        {/* Architecture Flow */}
        <h3 className="text-sm uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 pt-4">
          Data Flow Architecture
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <Layout className="w-6 h-6 text-brand-600 dark:text-brand-400 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">React Frontend</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Queries `/api/research`</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <Server className="w-6 h-6 text-brand-600 dark:text-brand-400 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Express REST API</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Normalizes & processes data</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <Database className="w-6 h-6 text-brand-600 dark:text-brand-400 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">OpenAlex API</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Scholarly works source</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Skills Demonstrated</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {technicalCompetencies.map((skill, i) => (
            <div key={i} className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>{skill}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}