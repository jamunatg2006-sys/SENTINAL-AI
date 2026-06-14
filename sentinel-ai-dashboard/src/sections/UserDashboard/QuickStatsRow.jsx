import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import AnimatedCounter from '../../components/common/AnimatedCounter';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, type: 'spring', stiffness: 100 } },
};

const StatItem = ({ icon: Icon, iconColor, iconBg, iconBorder, value, label, trendLine, trendColor, glowColor }) => (
  <motion.div variants={cardVariants}>
    <GlassCard glowColor={glowColor} className="p-5 relative group">
      {/* Background glow blob */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-accent-red/5 via-transparent to-transparent" />
      </div>

      <div className="relative z-10">
        {/* Icon row */}
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg ${iconBg} ${iconBorder} border group-hover:shadow-md transition-all duration-300`}>
            <Icon className={`w-5 h-5 ${iconColor} group-hover:scale-110 transition-transform duration-300`} />
          </div>
          <div className={`text-xs font-mono ${trendColor} opacity-70`}>LIVE</div>
        </div>

        {/* Counter */}
        <div className="text-4xl font-black font-mono mb-1">
          <AnimatedCounter target={typeof value === 'number' ? value : 0} />
        </div>

        {/* Label */}
        <div className="text-text-secondary text-xs font-bold uppercase tracking-wider mb-2">
          {label}
        </div>

        {/* Trend */}
        {trendLine && (
          <div className={`flex items-center gap-1 text-xs font-mono ${trendColor}`}>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            {trendLine}
          </div>
        )}
      </div>
    </GlassCard>
  </motion.div>
);

const QuickStatsRow = ({ scanHistory = [] }) => {
  const totalScans = scanHistory.length;
  const totalVulns = scanHistory.reduce((sum, s) => sum + (s.totalVulnerabilities || 0), 0);
  const totalResolved = scanHistory.reduce((sum, s) => sum + (s.resolvedVulnerabilities || 0), 0);
  const bestScore = scanHistory.length > 0
    ? Math.max(...scanHistory.map((s) => s.scoreAfter ?? 0))
    : 0;
  const bestScoreDomain = scanHistory.length > 0
    ? (scanHistory.reduce((best, s) => (!best || (s.scoreAfter ?? 0) > (best.scoreAfter ?? 0)) ? s : best, null)?.domain || '—')
    : '—';
  const resolutionRate = totalVulns > 0 ? Math.round((totalResolved / totalVulns) * 100) : 0;

  const stats = [
    {
      icon: Shield,
      iconColor: 'text-accent-cyan',
      iconBg: 'bg-accent-cyan/10',
      iconBorder: 'border-accent-cyan/30',
      value: totalScans,
      label: 'Total Scans',
      trendLine: totalScans > 0 ? `${Math.min(totalScans, 3)} this week` : 'No scans yet',
      trendColor: 'text-status-success',
      glowColor: 'cyan',
    },
    {
      icon: AlertTriangle,
      iconColor: 'text-accent-red',
      iconBg: 'bg-accent-red/10',
      iconBorder: 'border-accent-red/30',
      value: totalVulns,
      label: 'Vulnerabilities Found',
      trendLine: 'across all scans',
      trendColor: 'text-accent-red',
      glowColor: 'red',
    },
    {
      icon: CheckCircle2,
      iconColor: 'text-status-success',
      iconBg: 'bg-status-success/10',
      iconBorder: 'border-status-success/30',
      value: totalResolved,
      label: 'Issues Resolved',
      trendLine: totalVulns > 0 ? `${resolutionRate}% resolution rate` : 'No issues yet',
      trendColor: 'text-status-success',
      glowColor: 'success',
    },
    {
      icon: TrendingUp,
      iconColor: 'text-accent-purple',
      iconBg: 'bg-accent-purple/10',
      iconBorder: 'border-accent-purple/30',
      value: bestScore,
      label: 'Best Security Score',
      trendLine: bestScoreDomain !== '—' ? bestScoreDomain : 'Run a scan first',
      trendColor: 'text-accent-purple',
      glowColor: 'purple',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map((stat) => (
        <StatItem key={stat.label} {...stat} />
      ))}
    </motion.div>
  );
};

export default QuickStatsRow;
