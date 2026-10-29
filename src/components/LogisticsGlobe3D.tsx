/**
 * MFT Logistics Network Component
 * Replaces the previous oversized black 3D globe with the new interactive,
 * code-generated UK Courier Network Map with galaxy particle backdrop.
 */

import React from 'react';
import { UkCourierNetworkMap, UK_NETWORK_CITIES, UkCityNode } from './UkCourierNetworkMap';

export type DestinationNode = UkCityNode;
export const DESTINATIONS = UK_NETWORK_CITIES;

export interface LogisticsGlobe3DProps {
  onSelectDestination?: (dest: DestinationNode) => void;
  activeDestinationId?: string;
  className?: string;
}

export const LogisticsGlobe3D: React.FC<LogisticsGlobe3DProps> = ({
  onSelectDestination,
  activeDestinationId = 'london',
  className = '',
}) => {
  return (
    <UkCourierNetworkMap
      activeDestinationId={activeDestinationId}
      onSelectDestination={onSelectDestination}
      className={className}
    />
  );
};
