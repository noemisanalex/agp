import React from 'react';

export default function DashboardSection({ title, children }) {
  return (
    <section className="mb-12 animate-fade-in">
      <h2 className="text-xl font-bold text-blue-400 mb-4 border-b border-blue-900/30 pb-2 pl-1">
        {title}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {children}
      </div>
    </section>
  );
}
