import React, { useRef, useState, useLayoutEffect } from 'react';
import { Card } from '@mantine/core';
import { redirectToUrl } from '@/utils/route';

const modules = [
  { name: 'Projects', path: '/projects' },
  { name: 'My Tasks', path: '/my-work/tasks' },
  { name: 'Users', path: '/users' },
  { name: 'Invoices', path: '/invoices' },
  { name: 'Reports', path: '/reports' },
  { name: 'Settings', path: '/settings' },
];

const CircularMenu = ({ size = 260, radius = 0.35 }) => {
  const ringRef = useRef(null);
  const [radiusPx, setRadiusPx] = useState(0);

  useLayoutEffect(() => {
    const update = () => {
      const el = ringRef.current;
      if (!el) return;
      const w = el.clientWidth;
      // radius is fraction of half-width; radius prop is fraction of half-width
      const r = Math.max(30, (w / 2) * radius);
      setRadiusPx(r);
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [radius]);

  return (
    <div className="circular-menu" style={{ width: '100%', maxWidth: size }}>
      <div className="ring" ref={ringRef} style={{ width: size, height: size }}>
        {modules.map((m, i) => {
          const angle = (i / modules.length) * 360;
          const transform = `rotate(${angle}deg) translate(${radiusPx}px) rotate(-${angle}deg)`;

          return (
            <a
              key={m.name}
              href={m.path}
              onClick={(e) => {
                e.preventDefault();
                redirectToUrl(m.path);
              }}
              className="node"
              style={{ transform }}
              title={m.name}
            >
              <div className="node-inner">
                <Card shadow="sm" p="xs" radius="xl" className="node-card">
                  <div style={{ fontSize: 13, textAlign: 'center' }}>{m.name}</div>
                </Card>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default CircularMenu;
