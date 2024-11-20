import React from 'react';
import { FaGithub, FaXTwitter, FaLinkedin, FaInstagram, FaHeart } from 'react-icons/fa6';

export const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'transparent' }}>
      <div
        style={{
          maxWidth: '1400px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '1rem',   // Equivalent to px-4
          paddingRight: '1.5rem',// Equivalent to sm:px-6
          paddingTop: '1rem',    // Equivalent to py-4
          paddingBottom: '1rem', // Equivalent to py-4
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <p style={{ color: '#4b5563', fontSize: '0.875rem', textAlign: 'center' }}>
            Made with <FaHeart style={{ color: '#f87171' }} className="inline h-4 w-4" /> by <strong>Siby</strong>
          </p>
          <ul style={{ display: 'flex', gap: '1rem' }}>
            <li>
              <a
                href="https://github.com/sibycr18"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                style={{ color: '#4b5563', textDecoration: 'none' }}
              >
                <FaGithub className="h-5 w-5" />
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/siby.cr/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                style={{ color: '#d1358f', textDecoration: 'none' }}
              >
                <FaInstagram className="h-5 w-5" />
              </a>
            </li>
            <li>
              <a
                href="https://x.com/siby_cr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                style={{ color: '#2563eb', textDecoration: 'none' }}
              >
                <FaXTwitter className="h-5 w-5 text-[#4B5563]" />
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/sibycr/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                style={{ color: '#1d4ed8', textDecoration: 'none' }}
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
