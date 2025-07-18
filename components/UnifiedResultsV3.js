/**
 * Unified Results Component V3
 * Last Updated: 2025-01-18T11:20:00Z
 * Version: 3.1.0
 * Changes: Single metric, better mobile layout, focus/growth areas
 */

import React from 'react';
import { PATH_LABELS } from '../lib/quiz/ui.js';

const UnifiedResultsV3 = ({ scoreResult, responses, pathway }) => {
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
    ? `${PATH_LABELS[topPath.path] || getPathInfo(topPath.path).name} - Core Focus`
    : `${PATH_LABELS[topPath.path] || getPathInfo(topPath.path).name} - Recommended Focus`;
  
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
      </div>
      
      
      <div className="space-y-6 mb-8">
        {sortedPaths.map((pathData, index) => {
          const isPrimary = index === 0;
          const isSecondary = index === 1;
          const info = getPathInfo(pathData.path, pathData.level, isPrimary);
          const levelStyle = getLevelStyle(pathData.level);
          const alignmentScore = Math.round(pathData.absPct);
          
          return (
            <div key={pathData.path} className="relative">
              
              {/* Archetype Card */}
              <div className={`p-4 rounded-xl bg-gradient-to-r ${
                isPrimary ? 'from-white/15 to-white/8 border-2 border-[#1DD1A1]/30' : 
                isSecondary ? 'from-white/10 to-white/5 border border-white/20' :
                'from-white/5 to-white/[0.02] border border-white/10'
              } backdrop-blur-sm relative overflow-hidden`}>
                
                {/* Glow effect for primary */}
                {isPrimary && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1DD1A1]/10 to-[#B91372]/10 rounded-xl" />
                )}
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${info.color} rounded-full flex items-center justify-center shadow-lg ${isPrimary ? 'ring-2 ring-[#1DD1A1]/50' : ''}`}>
                        <span className="text-xl">{info.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-base font-bold ${isPrimary ? 'text-[#1DD1A1]' : 'text-white'}`}>{PATH_LABELS[pathData.path] || info.name}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${levelStyle.badge} whitespace-nowrap`}>
                            {levelStyle.icon} {pathData.level === 'Strategic Secondary' ? 'Secondary' : pathData.level}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <span className={`text-lg font-bold ${isPrimary ? 'text-[#1DD1A1]' : 'text-white'}`}>{alignmentScore}%</span>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-xs text-gray-300 mb-3 leading-relaxed">
                    {info.focusMessage}
                  </p>
                  
                  {/* Focus Areas & Growth Areas - Only for Core Focus */}
                  {pathData.level === 'Core Focus' && (
                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <div>
                        <span className="text-xs font-semibold text-green-400">🎯 Focus Areas: </span>
                        <span className="text-xs text-gray-300">{info.focusAreas}</span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-blue-400">📈 Growth Areas: </span>
                        <span className="text-xs text-gray-300">{info.growthAreas}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Combined Roadmap Section */}
      <div className="bg-gradient-to-r from-[#1DD1A1]/10 to-[#B91372]/10 rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Your Strategic Roadmap</h3>
          <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-gray-300">
            {responses['stage-level'] === 'planning' ? 'Planning Stage' : 
             responses['stage-level'] === 'production' ? 'Production Stage' : 'Scale Stage'}
          </span>
        </div>
        
        {/* Strategic Roadmap Steps */}
        <div className="space-y-3">
          {pathway?.planPreview?.map((step, index) => (
            <div key={index} className="flex gap-3">
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                bg-gradient-to-r ${index === 0 ? 'from-[#1DD1A1] to-[#B91372]' : 'from-gray-500 to-gray-600'}
                text-white flex-shrink-0
              `}>
                {index + 1}
              </div>
              <p className="text-sm text-gray-300">{step}</p>
            </div>
          )) || [
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