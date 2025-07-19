/**
 * Unified Results Component V3
 * Last Updated: 2025-01-18T11:20:00Z
 * Version: 3.1.0
 * Changes: Single metric, better mobile layout, focus/growth areas
 */

import React from 'react';
import { PATH_LABELS } from '../lib/quiz/ui.js';

const UnifiedResultsV3 = ({ scoreResult, responses, pathway, aiPathwayDetails }) => {
  if (!scoreResult) return null;
  
  // Debug log to see what pathway details are available
  console.log('🔍 UnifiedResultsV3 aiPathwayDetails:', aiPathwayDetails);
  console.log('🔍 UnifiedResultsV3 pathway.pathwayDetails:', pathway?.pathwayDetails);
  
  
  const { displayPct, absPct, levels, recommendation } = scoreResult;
  
  // Convert to relative percentages that add up to 100%
  const totalAbsPct = Object.values(absPct).reduce((sum, pct) => sum + pct, 0);
  const relativePct = {};
  Object.entries(absPct).forEach(([path, pct]) => {
    relativePct[path] = Math.round((pct / totalAbsPct) * 100);
  });
  
  // Sort paths by absolute percentage
  const sortedPaths = Object.entries(absPct)
    .sort((a, b) => b[1] - a[1])
    .map(([path, pct]) => ({ path, absPct: pct, relativePct: relativePct[path], displayPct: displayPct[path], level: levels[path] }));
  
  const topPath = sortedPaths[0];
  const isCoreFocus = topPath.level === 'Core Focus';
  
  // Path metadata with focus/growth areas
  const getPathInfo = (path, level, isSelected) => {
    const base = {
      'touring-performer': {
        name: 'Touring Performer',
        icon: '🎤',
        color: 'from-blue-500 to-purple-600',
        focusMessage: aiPathwayDetails?.['touring-performer']?.focusMessage,
        focusAreas: aiPathwayDetails?.['touring-performer']?.focusAreas,
        growthAreas: aiPathwayDetails?.['touring-performer']?.growthAreas
      },
      'creative-artist': {
        name: 'Creative Artist', 
        icon: '🎨',
        color: 'from-pink-500 to-orange-500',
        focusMessage: aiPathwayDetails?.['creative-artist']?.focusMessage,
        focusAreas: aiPathwayDetails?.['creative-artist']?.focusAreas,
        growthAreas: aiPathwayDetails?.['creative-artist']?.growthAreas
      },
      'writer-producer': {
        name: 'Writer/Producer',
        icon: '🎹', 
        color: 'from-green-500 to-teal-500',
        focusMessage: aiPathwayDetails?.['writer-producer']?.focusMessage,
        focusAreas: aiPathwayDetails?.['writer-producer']?.focusAreas,
        growthAreas: aiPathwayDetails?.['writer-producer']?.growthAreas
      }
    };
    return base[path] || {};
  };
  
  // Level styling
  const getLevelStyle = (level) => {
    switch(level) {
      case 'Core Focus':
        return { badge: 'bg-green-500/20 text-green-400 border-green-500/30', icon: '🏆' };
      case 'Strategic Secondary':
        return { badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: '⚡' };
      case 'Noise':
        return { badge: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: '·' };
      default:
        return { badge: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: '·' };
    }
  };
  
  // Generate main headline 
  const headline = isCoreFocus 
    ? `${PATH_LABELS[topPath.path] || getPathInfo(topPath.path).name} - Core`
    : `${PATH_LABELS[topPath.path] || getPathInfo(topPath.path).name} - Recommended`;
  
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
  
  // Generate description without percentages
  const generateDescription = () => {
    const primary = sortedPaths[0];
    const secondary = sortedPaths[1];
    const stage = responses['stage-level'];
    
    
    if (primary.level === 'Core Focus' && secondary.level === 'Strategic Secondary') {
      return `Your ${PATH_LABELS[primary.path]} strength should lead your strategy, with your ${PATH_LABELS[secondary.path]} skills as strategic support. This balance creates the fastest path to your vision.`;
    } else if (primary.level === 'Core Focus') {
      return `Your ${PATH_LABELS[primary.path]} strength is your clear advantage. This is where you naturally excel and should invest most of your energy for ${stage} stage success.`;
    } else {
      return `Your ${PATH_LABELS[primary.path]} path shows the strongest potential. Start here to build clarity and momentum in your music career.`;
    }
  };
  
  return (
    <div className="mb-8">
      
      <div className="space-y-6 mb-8">
        {sortedPaths.map((pathData, index) => {
          const isPrimary = index === 0;
          const isSecondary = index === 1;
          const info = getPathInfo(pathData.path, pathData.level, isPrimary);
          const levelStyle = getLevelStyle(pathData.level);
          const relativeScore = pathData.relativePct;
          
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
                        </div>
                      </div>
                    </div>
                    {/* Alignment Indicator */}
                    <div className="w-24 ml-4">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-full rounded-full bg-gradient-to-r ${info.color} transition-all duration-1000 ease-out`}
                          style={{ width: `${relativeScore}%` }}
                        />
                      </div>
                      {/* Badge under the bar */}
                      <div className="flex justify-center mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${levelStyle.badge} whitespace-nowrap`}>
                          {levelStyle.icon} {pathData.level === 'Strategic Secondary' ? 'Secondary' : pathData.level}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className={`text-xs text-gray-300 mb-3 leading-relaxed ${
                    isPrimary ? '' : ''
                  }`}>
                    {info.focusMessage}
                    {pathData.level === 'Core Focus' && (
                      <span className="block mt-2 text-gray-400">
                        This is your natural strength. The skills, mindset, and approach that come most easily to you. 
                        When you lean into this path, work feels more like play and progress accelerates.
                      </span>
                    )}
                    {pathData.level === 'Strategic Secondary' && (
                      <span className="block mt-2 text-gray-400">
                        This complements your primary focus. These skills can enhance your main path when developed strategically. 
                        Consider integrating these elements to create a more well-rounded approach.
                      </span>
                    )}
                  </p>
                  
                  {/* Focus Areas & Growth Areas - For Core Focus and Strategic Secondary */}
                  {(pathData.level === 'Core Focus' || pathData.level === 'Strategic Secondary') && (
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