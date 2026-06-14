import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
  Rocket, Download, Sparkles, ShieldOff, Plus
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import GlassCard from '../../components/common/GlassCard';
import GlowButton from '../../components/common/GlowButton';
import GridBackground from '../../components/background/GridBackground';
import ParticleField from '../../components/background/ParticleField';
import QuickStatsRow from './QuickStatsRow';
import ThreatTrendChart from './ThreatTrendChart';
import RecentScansTable from './RecentScansTable';

// ─── Common Threat data ────────────────────────────────────────────────────
const threatData = [
  { name: 'Missing CSP', count: 8, color: '#ff1a3c' },
  { name: 'Missing HSTS', count: 6, color: '#ff6b35' },
  { name: 'Dir Listing', count: 4, color: '#ffb84d' },
  { name: 'Outdated TLS', count: 3, color: '#ffd700' },
  { name: 'Exposed Headers', count: 2, color: '#00e5ff' },
];

const CustomBarTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      className="px-3 py-2 rounded-lg border border-accent-red/20 text-xs font-mono backdrop-blur-xl"
      style={{ background: 'rgba(5,5,10,0.92)' }}
    >
      <div className="text-text-secondary">{payload[0]?.payload?.name}</div>
      <div className="font-black" style={{ color: payload[0]?.fill }}>
        {payload[0]?.value} occurrences
      </div>
    </div>
  );
};

// ─── Page-level animation ──────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, type: 'spring', stiffness: 90 },
  }),
};

const UserDashboard = ({ onNewScan, onFutureVision }) => {
  const { scanHistory, goToSection } = useDashboard();

  const handleNewScan = () => {
    if (onNewScan) onNewScan();
    else goToSection('landing');
  };

  const handleFutureVision = () => {
    if (onFutureVision) onFutureVision();
    else goToSection('futureVision');
  };

  const isEmpty = !scanHistory || scanHistory.length === 0;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background layers */}
      <GridBackground />
      <ParticleField />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-bg-primary/60 pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-24 space-y-8">

        {/* ── TOP HEADER ── */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          {/* Left */}
          <div>
            <div className="text-[10px] font-mono tracking-[0.25em] text-accent-cyan uppercase mb-1">
              ◆ Operator Dashboard
            </div>
            <h1
              className="text-4xl md:text-5xl font-black tracking-tight text-text-primary"
              style={{ textShadow: '0 0 30px rgba(255,26,60,0.5)' }}
            >
              Mission Control
            </h1>
            <p className="text-text-dim text-sm font-mono mt-1">Welcome back, Operator</p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <GlowButton
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={handleNewScan}
              className="!px-5 !py-2.5 !text-xs"
            >
              New Scan
            </GlowButton>

            {/* Avatar */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-black font-mono text-sm text-accent-red
                border-2 border-accent-red/60 bg-accent-red/10"
              style={{ boxShadow: '0 0 18px rgba(255,26,60,0.4)' }}
            >
              OP
            </div>
          </div>
        </motion.div>

        {/* ── EMPTY STATE ── */}
        {isEmpty ? (
          <motion.div
            custom={0.1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex justify-center pt-8"
          >
            <GlassCard glowColor="red" className="p-12 max-w-md w-full text-center">
              <ShieldOff
                className="w-16 h-16 mx-auto mb-5 text-accent-red/50"
              />
              <h3 className="text-xl font-bold text-text-primary mb-2">No scans yet</h3>
              <p className="text-text-dim text-sm font-mono mb-6">
                Run your first security audit to see results here
              </p>
              <GlowButton
                variant="primary"
                icon={<Rocket className="w-4 h-4" />}
                onClick={handleNewScan}
                fullWidth
              >
                Start First Scan
              </GlowButton>
            </GlassCard>
          </motion.div>
        ) : (
          <>
            {/* ── QUICK STATS ── */}
            <motion.div custom={0.05} variants={fadeUp} initial="hidden" animate="visible">
              <QuickStatsRow scanHistory={scanHistory} />
            </motion.div>

            {/* ── THREAT TREND CHART ── */}
            <motion.div custom={0.15} variants={fadeUp} initial="hidden" animate="visible">
              <ThreatTrendChart scanHistory={scanHistory} />
            </motion.div>

            {/* ── RECENT SCANS TABLE ── */}
            <motion.div custom={0.2} variants={fadeUp} initial="hidden" animate="visible">
              <RecentScansTable scanHistory={scanHistory} />
            </motion.div>
          </>
        )}

        {/* ── BOTTOM ROW: Common Threats + Quick Actions ── */}
        <motion.div
          custom={isEmpty ? 0.15 : 0.28}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Left: Common Threats bar chart */}
          <GlassCard glowColor="red" className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-accent-red/10 border border-accent-red/30">
                <ShieldOff className="w-4 h-4 text-accent-red" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">
                  Most Common Threats
                </h3>
                <p className="text-[10px] text-text-dim font-mono mt-0.5">Top 5 across all scans</p>
              </div>
            </div>

            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={threatData}
                  layout="vertical"
                  margin={{ top: 0, right: 10, bottom: 0, left: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.04)"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fill: '#4b5563', fontSize: 9, fontFamily: 'JetBrains Mono, monospace' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={90}
                    tick={{ fill: '#6b7280', fontSize: 9, fontFamily: 'JetBrains Mono, monospace' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(255,26,60,0.05)' }} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={16} animationDuration={1000}>
                    {threatData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Right: Quick Actions */}
          <GlassCard glowColor="purple" className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-accent-purple/10 border border-accent-purple/30">
                <Rocket className="w-4 h-4 text-accent-purple" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">
                  Quick Actions
                </h3>
                <p className="text-[10px] text-text-dim font-mono mt-0.5">Jump to your next mission</p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Action 1 */}
              <GlowButton
                variant="primary"
                fullWidth
                icon={<Rocket className="w-4 h-4" />}
                onClick={handleNewScan}
              >
                Start New Security Audit
              </GlowButton>

              {/* Action 2 */}
              <GlowButton
                variant="secondary"
                fullWidth
                icon={<Download className="w-4 h-4" />}
                onClick={() => console.log('Download all reports')}
              >
                Download All Reports
              </GlowButton>

              {/* Action 3 — ghost */}
              <button
                onClick={handleFutureVision}
                className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl font-mono font-bold text-sm
                  uppercase tracking-wider border border-accent-purple/30 text-accent-purple
                  hover:bg-accent-purple/10 hover:border-accent-purple/60
                  transition-all duration-300 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                View Future Roadmap
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Bottom decorative label */}
        <div className="flex justify-center pt-2">
          <div className="text-[9px] font-mono text-text-dim opacity-30 tracking-widest">
            SENTINEL_AI · MISSION_CONTROL_v1.0 · OPERATOR_DASHBOARD
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
