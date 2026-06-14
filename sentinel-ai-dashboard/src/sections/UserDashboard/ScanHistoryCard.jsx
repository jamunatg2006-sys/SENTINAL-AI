import React from 'react';
import { motion } from 'framer-motion';
import { Globe, RefreshCw, ArrowRight, Eye } from 'lucide-react';
import SeverityBadge from '../../components/common/SeverityBadge';
import GlowButton from '../../components/common/GlowButton';

const relativeTime = (isoString) => {
  const now = Date.now();
  const diff = now - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const ScanHistoryCard = ({ scan, index = 0 }) => {
  const {
    id,
    domain,
    deploymentUrl,
    scannedAt,
    highestSeverity,
    totalVulnerabilities,
    resolvedVulnerabilities,
    scoreBefore,
    scoreAfter,
  } = scan;

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, type: 'spring', stiffness: 120 }}
      whileHover={{ scale: 1.01, transition: { duration: 0.18 } }}
      className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 px-5 py-4 rounded-xl border border-accent-red/10
        bg-gradient-to-r from-bg-panel/60 via-bg-secondary/40 to-bg-panel/60 backdrop-blur-sm
        hover:border-accent-red/50 hover:shadow-[0_0_24px_rgba(255,26,60,0.18)]
        transition-all duration-300 cursor-pointer"
    >
      {/* Hover glow inner */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none
        bg-gradient-to-r from-accent-red/5 via-transparent to-accent-cyan/5" />

      {/* Left: Domain info */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="p-2 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 shrink-0">
          <Globe className="w-4 h-4 text-accent-cyan" />
        </div>
        <div className="min-w-0">
          <div className="font-bold text-text-primary text-sm truncate">{domain || 'Unknown domain'}</div>
          {deploymentUrl && (
            <div className="text-[10px] text-text-dim font-mono truncate mt-0.5">{deploymentUrl}</div>
          )}
          <div className="text-[9px] text-text-dim font-mono mt-0.5 opacity-60">{id}</div>
        </div>
      </div>

      {/* Center-left: Date */}
      <div className="shrink-0 text-right sm:text-center min-w-[80px]">
        <div className="text-xs font-mono text-text-dim">
          {new Date(scannedAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: '2-digit' })}
        </div>
        <div className="text-[10px] font-mono text-text-dim opacity-60 mt-0.5">
          {relativeTime(scannedAt)}
        </div>
      </div>

      {/* Center: Severity + vuln count */}
      <div className="shrink-0 flex flex-col items-center gap-1 min-w-[100px]">
        <SeverityBadge severity={highestSeverity || 'LOW'} size="sm" animated={false} />
        <span className="text-[10px] text-text-dim font-mono">
          {totalVulnerabilities ?? 0} vulnerabilities
        </span>
      </div>

      {/* Center-right: Score before → after */}
      <div className="shrink-0 flex items-center gap-2 font-mono min-w-[90px] justify-center">
        <span className="text-sm font-bold text-accent-red">{scoreBefore ?? '—'}</span>
        <ArrowRight className="w-3 h-3 text-text-dim shrink-0" />
        <span className="text-base font-black text-status-success">{scoreAfter ?? '—'}</span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <GlowButton
          variant="secondary"
          className="!px-3 !py-1.5 !text-xs"
          icon={<Eye className="w-3 h-3" />}
          onClick={(e) => { e.stopPropagation(); console.log('View report', id); }}
        >
          View Report
        </GlowButton>
        <button
          onClick={(e) => { e.stopPropagation(); console.log('Re-scan', domain); }}
          className="p-1.5 rounded-lg border border-accent-red/20 text-text-dim hover:text-accent-red
            hover:border-accent-red/50 transition-all duration-200 bg-transparent"
          title="Re-scan"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};

export default ScanHistoryCard;
