"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedBeamProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  active: boolean;
  direction: 'inbound' | 'outbound' | 'bidirectional';
  color: string;
}

export function AnimatedBeam({
  startX,
  startY,
  endX,
  endY,
  active,
  direction,
  color = '#3b82f6', // Default blue
}: AnimatedBeamProps) {
  // Generate a unique ID for the gradient
  const gradientId = React.useMemo(
    () => `gradient-${Math.random().toString(36).substr(2, 9)}`,
    []
  );
  
  // Calculate path
  const pathLength = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
  const curvature = pathLength * 0.2; // 20% of the path length for smooth curve
  
  // Calculate control points
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  const dx = endX - startX;
  const dy = endY - startY;
  
  // Perpendicular vector
  const perpX = -dy;
  const perpY = dx;
  const perpLength = Math.sqrt(perpX * perpX + perpY * perpY);
  const normPerpX = perpX / perpLength;
  const normPerpY = perpY / perpLength;
  
  // Control point offset
  const cpX = midX + normPerpX * curvature;
  const cpY = midY + normPerpY * curvature;
  
  // Path command
  const pathD = `M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`;
  
  // Animation variants
  const beamVariants = {
    inactive: { opacity: 0.3, pathLength: 0 },
    active: { opacity: 0.8, pathLength: 1 },
  };
  
  return (
    <>
      <defs>
        <linearGradient
          id={gradientId}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
          gradientUnits="userSpaceOnUse"
          gradientTransform={`rotate(${Math.atan2(dy, dx) * (180 / Math.PI)})`}
        >
          <motion.stop
            offset="0%"
            stopColor={color}
            stopOpacity="0.3"
            animate={{
              offset: direction === 'inbound' ? ["0%", "100%"] : ["0%", "0%"],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.stop
            offset="50%"
            stopColor={color}
            stopOpacity="0.8"
            animate={{
              offset: [
                direction === 'inbound' ? "30%" : "30%",
                direction === 'inbound' ? "130%" : "-70%",
              ],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.stop
            offset="100%"
            stopColor={color}
            stopOpacity="0.3"
            animate={{
              offset: direction === 'inbound' ? ["100%", "100%"] : ["100%", "0%"],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </linearGradient>
      </defs>
      
      <motion.path
        d={pathD}
        stroke={`url(#${gradientId})`}
        strokeWidth={active ? 4 : 2}
        fill="none"
        variants={beamVariants}
        initial="inactive"
        animate={active ? "active" : "inactive"}
        transition={{ 
          duration: 1, 
          ease: "easeInOut",
        }}
      />
    </>
  );
}
