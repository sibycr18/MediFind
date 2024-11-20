import React from 'react';
import { GiMedicines } from 'react-icons/gi';

export const Header = () => {
  return (
    <header style={{ backgroundColor: 'transparent' }}>
      <div
        style={{
          maxWidth: '1400px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '1.5rem',  // Equivalent to px-6
          paddingRight: '2rem',   // Equivalent to px-8
          paddingTop: '3rem',     // Equivalent to py-12 (12 * 0.25rem = 3rem)
          paddingBottom: '0.5rem',  // Equivalent to py-12
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <GiMedicines style={{ height: '3rem', width: '3rem', color: '#2563eb' }} /> {/* text-blue-600 */}
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937' }}>MediFind</h1> {/* text-3xl and text-gray-900 */}
        </div>
      </div>
    </header>
  );
};
