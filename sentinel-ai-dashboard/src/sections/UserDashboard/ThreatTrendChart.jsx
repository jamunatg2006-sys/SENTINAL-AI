import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Dot
} from 'recharts';
import { TrendingUp, BarChart2 } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';

const CustomDot = ({ cx, cy, stroke }) => (
  <g>
    <circle cx={cx} cy={cy} r={5} fill={stroke} stroke={stroke} strokeWidth={2} />
    <circle cx={cx} cy={cy} r={9} fill="none" stroke={stroke} strokeWidth={1} opacity={0.4} />
  </g>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      className="px-4 py-3 rounded-xl border border-accent-red/30 backdrop-blur-xl text-xs font-mono"
      style={{
        background: 'rgba(5,5,10,0.92)',
        boxShadow: '0 0 20px rgba(255,26,60,0.2)',
      }}
    >
      <p className="text-text-dim mb-2 tracking-widest uppercase">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2 mb-1">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ background: entry.color }}
          />
          <span className="text-text-secondary capitalize">
            {entry.dataKey === 'before' ? 'Before Fix' : 'After Fix'}:
          </span>
          <span className="font-black" style={{ color: entry.color }}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const ThreatTrendChart = ({ scanHistory = [] }) => {
  const hasEnoughData = scanHistory.length >= 2;

  const chartData = scanHistory.map((scan) => ({
    date: new Date(scan.scannedAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
    before: scan.scoreBefore ?? 0,
    after: scan.scoreAfter ?? 0,
  }));

  return (
    <GlassCard glowColor="cyan" className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30">
            <TrendingUp className="w-4 h-4 text-accent-cyan" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary tracking-wide uppercase">
              Security Score History
            </h3>
            <p className="text-xs text-text-dim font-mono mt-0.5">Score improvement across all scans</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-0.5 bg-accent-red rounded" />
            <span className="text-text-dim">Before Fix</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-0.5 bg-status-success rounded" />
            <span className="text-text-dim">After Fix</span>
          </span>
        </div>
      </div>

      {/* Chart or placeholder */}
      {hasEnoughData ? (
        <motion.div
          initial={{ opacity: 0, scaleX: 0.8 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ height: 260 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
                axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="before"
                stroke="#ff1a3c"
                strokeWidth={2}
                dot={<CustomDot stroke="#ff1a3c" />}
                activeDot={{ r: 6, fill: '#ff1a3c', stroke: '#ff1a3c', strokeWidth: 2 }}
                animationDuration={1200}
              />
              <Line
                type="monotone"
                dataKey="after"
                stroke="#39ff8a"
                strokeWidth={2}
                dot={<CustomDot stroke="#39ff8a" />}
                activeDot={{ r: 6, fill: '#39ff8a', stroke: '#39ff8a', strokeWidth: 2 }}
                animationDuration={1400}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center"
          style={{ height: 260 }}
        >
          <BarChart2 className="w-12 h-12 text-text-dim mb-3 opacity-40" />
          <p className="text-text-secondary font-mono text-sm">Scan more domains to see trends</p>
          <p className="text-text-dim font-mono text-xs mt-1">
            At least 2 scans required to display chart
          </p>
        </motion.div>
      )}
    </GlassCard>
  );
};

export default ThreatTrendChart;
