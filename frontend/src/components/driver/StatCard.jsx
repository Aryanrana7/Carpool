import React from 'react';
import StatTile from '../ui/StatTile';

/**
 * StatCard compatibility wrapper around StatTile.
 * Preserves existing component API while routing through design system tokens.
 */
export const StatCard = ({ icon, label, value, sub, children }) => {
  return (
    <StatTile
      icon={icon}
      label={label}
      value={value}
      subtext={sub}
    >
      {children}
    </StatTile>
  );
};

export default StatCard;
