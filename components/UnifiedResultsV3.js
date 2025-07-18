/**
 * Unified Results Component V3
 * Last Updated: 2025-01-18T11:20:00Z
 * Version: 3.1.0
 * Changes: Single metric, better mobile layout, focus/growth areas
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
  
  // Path metadata with focus/growth areas
  const getPathInfo = (path, level, isSelected) => {
    const base = {
      'touring-performer': {
        name: 'Touring Performer',
        icon: '🎤',
        color: 'from-blue-500 to-purple-600',
        focusMessage: isSelected ? 'Live energy is your superpower. Own the stage.' : 'Live performance can amplify your main path.',
        focusAreas: 'Stage presence • Audience connection • Live sound • Touring strategy',
        growthAreas: 'Balance studio time with stage time • Build authentic social presence • Embrace new venues'
      },
      'creative-artist': {
        name: 'Creative Artist', 
        icon: '🎨',
        color: 'from-pink-500 to-orange-500',
        focusMessage: isSelected ? 'Your creative vision builds lasting impact and income.' : 'Creative skills can enhance your primary focus.',
        focusAreas: 'Brand development • Content creation • Digital marketing • Revenue streams',
        growthAreas: 'Stay authentic to your vision • Balance content with artistic growth • Focus over trends'
      },
      'writer-producer': {
        name: 'Writer/Producer',
        icon: '🎹', 
        color: 'from-green-500 to-teal-500',
        focusMessage: isSelected ? 'Your technical skills create lasting value and partnerships.' : 'Production expertise can support your main strengths.',
        focusAreas: 'Production mastery • Collaboration network • Business development • Royalty optimization',
        growthAreas: 'Balance solo work with collaboration • Explore performance opportunities • Build strategic partnerships'
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
    const stage = responses['stage-level'];
    const topPathLabel = PATH_LABELS[topPath.path];
    
    if (isCoreFocus && sortedPaths[1]?.level === 'Strategic Secondary') {
      return `Your ${topPathLabel} strength is your main driver. Use your ${PATH_LABELS[sortedPaths[1].path]} skills as strategic support.`;
    } else if (isCoreFocus) {
      const verb = stage === 'scale' ? 'Scale your expertise in' : stage === 'production' ? 'Master your skills in' : 'Build your foundation in';
      return `${verb} ${topPathLabel}. This is where you naturally excel and should focus most of your energy.`;
    } else {
      const verb = stage === 'scale' ? 'Optimize and scale your' : stage === 'production' ? 'Develop mastery in' : 'Start with';
      return `${verb} ${topPathLabel} path. This has the strongest potential based on your responses.`;
    }
  })();
  
  return (
    <div className="mb-8">
      {/* Main Headline Section */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">{headline}</h2>
        <p className="text-sm text-gray-300 max-w-md mx-auto">{strategy}</p>
      </div>
      
      {/* Path Cards */}
      <div className="space-y-4 mb-8">
        {sortedPaths.map((pathData, index) => {
          const isPrimary = index === 0;
          const info = getPathInfo(pathData.path, pathData.level, isPrimary);
          const levelStyle = getLevelStyle(pathData.level);
          const alignmentScore = Math.round(pathData.absPct);
          
          return (
            <div key={pathData.path} className={`
              rounded-xl p-5 transition-all
              ${isPrimary ? 'bg-gradient-to-r from-white/15 to-white/8 border-2 border-white/30' : 'bg-white/5 border border-white/10'}
              ${isPrimary ? 'ring-1 ring-white/20' : ''}
            `}>
              {/* Header Row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${info.color} flex items-center justify-center shadow-lg`}>
                    <span className="text-xl">{info.icon}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-bold text-white">{PATH_LABELS[pathData.path] || info.name}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${levelStyle.badge}`}>
                        {levelStyle.icon} {pathData.level}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">
                      {info.focusMessage}
                    </p>
                  </div>
                </div>
                
                {/* Single Alignment Score */}
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-white">{alignmentScore}%</span>
                    <div className="group relative">
                      <span className="text-gray-400 cursor-help text-sm">ⓘ</span>
                      <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-64 p-3 bg-gray-900 border border-gray-700 rounded-lg text-xs text-gray-300 z-10">
                        <div className="font-semibold text-white mb-1">Alignment Score</div>
                        How well this path matches your quiz responses. Higher scores mean stronger natural fit based on your motivation, vision, and success definition.
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">alignment</div>
                </div>
              </div>
              
              {/* Focus & Growth Areas (only for Core Focus) */}
              {pathData.level === 'Core Focus' && (
                <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-green-400">🎯 Focus Areas:</span>
                    <p className="text-xs text-gray-300 mt-1">{info.focusAreas}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-blue-400">📈 Growth Areas:</span>
                    <p className="text-xs text-gray-300 mt-1">{info.growthAreas}</p>
                  </div>
                </div>
              )}
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
            `Double down on ${PATH_LABELS[topPath.path]} mastery and opportunities`,
            'Set up weekly progress check-ins and accountability',
            'Connect with 3 successful people in your focus area',
            'Define one major 90-day milestone and track it'
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