import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ChevronRight } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import ScanHistoryCard from './ScanHistoryCard';

const RecentScansTable = ({ scanHistory = [] }) => {
  return (
    <GlassCard glowColor="red" className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent-red/10 border border-accent-red/30">
            <Clock className="w-4 h-4 text-accent-red" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary tracking-wide uppercase">
              Recent Scan History
            </h3>
            <p className="text-[10px] text-text-dim font-mono mt-0.5">
              Click any scan to view full report
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono text-text-dim">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
          {scanHistory.length} record{scanHistory.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent-red/20 to-transparent mb-4" />

      {/* Scan rows */}
      {scanHistory.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="text-text-dim text-sm font-mono">No scans recorded yet</div>
          <div className="text-text-dim text-xs font-mono mt-1 opacity-60">
            Complete a full audit to populate this list
          </div>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {[...scanHistory].reverse().map((scan, idx) => (
            <ScanHistoryCard key={scan.id} scan={scan} index={idx} />
          ))}
        </div>
      )}

      {/* Footer hint */}
      {scanHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 flex items-center justify-center gap-1 text-[10px] font-mono text-text-dim opacity-50"
        >
          <ChevronRight className="w-3 h-3" />
          Showing all {scanHistory.length} scan{scanHistory.length !== 1 ? 's' : ''}
        </motion.div>
      )}
    </GlassCard>
  );
};

export default RecentScansTable;
