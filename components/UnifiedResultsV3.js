/**
 * Unified Results Component V3
 * Last Updated: 2025-01-18T11:00:00Z
 * Version: 3.0.0
 */

import React from 'react';
import { PATH_LABELS } from '../lib/quiz/ui.js';

const UnifiedResultsV3 = ({ scoreResult, responses }) => {
  if (!scoreResult) return null;
  
  const { displayPct, absPct, levels, recommendation } = scoreResult;
  
  // Sort paths by absolute percentage
  const sortedPaths = Object.entries(absPct)
    .sort((a, b) => b[1] - a[1])
    .map(([path, pct]) => ({ path, absPct: pct, displayPct: displayPct[path], level: levels[path] }));
  
  const topPath = sortedPaths[0];
  const isCoreFocus = topPath.level === 'Core Focus';
  
  // Path metadata
  const getPathInfo = (path) => {
    const base = {
      'touring-performer': {
        name: 'Touring Performer',
        icon: '🎤',
        color: 'from-blue-500 to-purple-600',
        focusMessage: 'Live performance drives your success. Build your touring career through consistent shows and fan connection.',
        supportMessage: 'Use performance skills to enhance your main focus area.'
      },
      'creative-artist': {
        name: 'Creative Artist',
        icon: '🎨',
        color: 'from-pink-500 to-orange-500',
        focusMessage: 'Creative expression fuels your career. Build sustainable income through your artistic vision.',
        supportMessage: 'Let creativity complement your primary path.'
      },
      'writer-producer': {
        name: 'Writer/Producer',
        icon: '🎹',
        color: 'from-green-500 to-teal-500',
        focusMessage: 'Technical mastery creates opportunity. Build partnerships and royalty income through your production skills.',
        supportMessage: 'Production skills can amplify your main strengths.'
      }
    };
    return base[path] || {};
  };
  
  // Level styling
  const getLevelStyle = (level) => {
    switch(level) {
      case 'Core Focus':
        return { badge: 'bg-green-500/20 text-green-400 border-green-500/30', icon: '🎯' };
      case 'Strategic Secondary':
        return { badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: '⚡' };
      case 'Noise':
        return { badge: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: '·' };
      default:
        return { badge: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: '·' };
    }
  };
  
  // Generate main headline and strategy
  const headline = isCoreFocus 
    ? `Core Focus: ${PATH_LABELS[topPath.path] || getPathInfo(topPath.path).name}`
    : `Recommended Focus: ${PATH_LABELS[topPath.path] || getPathInfo(topPath.path).name}`;
  
  const strategy = (() => {
    if (isCoreFocus && sortedPaths[1]?.level === 'Strategic Secondary') {
      return `Focus 70% on ${PATH_LABELS[topPath.path]}, leverage 30% on ${PATH_LABELS[sortedPaths[1].path]} as strategic support`;
    } else if (isCoreFocus) {
      return `Dedicate 80% of your energy to mastering ${PATH_LABELS[topPath.path]}`;
    } else {
      return `Start with ${PATH_LABELS[topPath.path]} to build momentum and clarity`;
    }
  })();
  
  return (
    <div className="mb-8">
      {/* Main Headline Section */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">{headline}</h2>
        <p className="text-sm text-gray-300 max-w-md mx-auto">{strategy}</p>
      </div>
      
      {/* Compact Path Rows */}
      <div className="space-y-3 mb-8">
        {sortedPaths.map((pathData, index) => {
          const info = getPathInfo(pathData.path);
          const levelStyle = getLevelStyle(pathData.level);
          const isPrimary = index === 0;
          
          return (
            <div key={pathData.path} className={`
              flex items-center gap-4 p-4 rounded-lg
              ${isPrimary ? 'bg-gradient-to-r from-white/10 to-white/5 border border-white/20' : 'bg-white/5 border border-white/10'}
              transition-all hover:bg-white/10
            `}>
              {/* Icon */}
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${info.color} flex items-center justify-center`}>
                <span className="text-lg">{info.icon}</span>
              </div>
              
              {/* Path Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{PATH_LABELS[pathData.path] || info.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs border ${levelStyle.badge}`}>
                    {levelStyle.icon} {pathData.level}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {isPrimary ? info.focusMessage : info.supportMessage}
                </p>
              </div>
              
              {/* Percentage with Bar */}
              <div className="text-right w-24">
                <div className="text-lg font-bold text-white">{pathData.displayPct}%</div>
                <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${info.color}`}
                    style={{ width: `${pathData.displayPct}%` }}
                  />
                </div>
                {pathData.absPct !== pathData.displayPct && (
                  <div className="text-[10px] text-gray-500 mt-0.5">Signal: {Math.round(pathData.absPct)}%</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Roadmap Section */}
      <div className="bg-gradient-to-r from-[#1DD1A1]/10 to-[#B91372]/10 rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white">Your Next 90 Days</h3>
          <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-gray-300">
            {responses['stage-level'] === 'planning' ? 'Planning Stage' : 
             responses['stage-level'] === 'production' ? 'Production Stage' : 'Scale Stage'}
          </span>
        </div>
        
        <div className="space-y-3">
          {[
            `Focus 70% on ${PATH_LABELS[topPath.path]} to build momentum`,
            'Create consistent progress tracking system',
            'Connect with 3 people in your focus area',
            'Set measurable 90-day milestone'
          ].map((item, index) => (
            <div key={index} className="flex gap-3">
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                bg-gradient-to-r ${index === 0 ? 'from-[#1DD1A1] to-[#B91372]' : 'from-gray-500 to-gray-600'}
                text-white flex-shrink-0
              `}>
                {index + 1}
              </div>
              <p className="text-sm text-gray-300">{item}</p>
            </div>
          ))}
        </div>
        
        <p className="text-xs text-gray-400 mt-4 italic">
          Why this matters: Clear focus accelerates progress. These steps build momentum in your strongest area while maintaining strategic balance.
        </p>
      </div>
    </div>
  );
};

export default UnifiedResultsV3;