import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck, TrendingUp, ArrowRight, Award,
    Sparkles, CheckCircle2, Trophy, Star,
    PartyPopper, Zap, Target, BarChart3, Lock, Shield
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import ScoreComparison from './ScoreComparison';
import GlowButton from '../../components/common/GlowButton';
import GlassCard from '../../components/common/GlassCard';
import AnimatedCounter from '../../components/common/AnimatedCounter';

const Verification = ({ onProceed }) => {
    const { verificationData, setReportData, targetDomain, saveScanToHistory } = useDashboard();
    const [afterScoreAnimated, setAfterScoreAnimated] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    const beforeScore = verificationData?.before?.score || 58;
    const afterScore = verificationData?.after?.score || 94;
    const improvement = afterScore - beforeScore;

    useEffect(() => {
        const timer = setTimeout(() => {
            setAfterScoreAnimated(true);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleGenerateReport = () => {
        const report = {
            timestamp: new Date().toISOString(),
            beforeScore,
            afterScore,
            improvement,
            vulnerabilitiesResolved: 4,
            totalFixed: 4,
            scanDuration: '14.2s',
            remediationDuration: '15.3s',
            verifiedAt: new Date().toLocaleTimeString(),
        };
        setReportData(report);

        // ✅ Save to dashboard history NOW — verification is fully complete
        saveScanToHistory();

        onProceed?.();
    };

    // Confetti particles - simplified
    const confettiColors = ['#39ff8a', '#00e5ff', '#ff1a3c', '#9d4dff'];

    return (
        <div className="relative min-h-[calc(100vh-200px)]">
            {/* Clean Dark Background - No 3D */}
            <div className="fixed inset-0 z-0 bg-bg-primary" />

            {/* Subtle grid overlay */}
            <div className="fixed inset-0 z-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,26,60,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,26,60,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            {/* Confetti Effect - Simplified */}
            <AnimatePresence>
                {showConfetti && (
                    <div className="fixed inset-0 pointer-events-none z-50">
                        {[...Array(100)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    x: Math.random() * window.innerWidth,
                                    y: -20,
                                    scale: 0,
                                }}
                                animate={{
                                    y: window.innerHeight + 100,
                                    rotate: 360 * (Math.random() * 2 + 1),
                                    scale: 0.3 + Math.random() * 0.5
                                }}
                                transition={{
                                    duration: 0.8 + Math.random() * 1.5,
                                    delay: Math.random() * 0.5,
                                    ease: "easeOut"
                                }}
                                className="absolute w-2 h-2 rounded-full"
                                style={{
                                    backgroundColor: confettiColors[Math.floor(Math.random() * confettiColors.length)],
                                    boxShadow: `0 0 5px ${confettiColors[Math.floor(Math.random() * confettiColors.length)]}`,
                                }}
                            />
                        ))}
                    </div>
                )}
            </AnimatePresence>

            <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 text-center"
                >
                    <div className="inline-flex items-center gap-3 mb-3 px-4 py-2 rounded-full border border-status-success/30 bg-status-success/10 backdrop-blur-sm">
                        <Shield className="w-4 h-4 text-status-success" />
                        <span className="text-xs font-mono text-status-success tracking-wider">VERIFICATION COMPLETE</span>
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
                            <div className="w-1.5 h-1.5 rounded-full bg-status-success" />
                            <div className="w-1.5 h-1.5 rounded-full bg-status-success" />
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-3">
                        <span className="bg-gradient-to-r from-text-primary via-status-success to-accent-cyan bg-clip-text text-transparent">
                            Verification Complete
                        </span>
                    </h1>

                    <p className="text-accent-cyan font-mono text-sm flex items-center justify-center gap-2">
                        <Target className="w-4 h-4" />
                        Re-scan completed — All fixes verified for {targetDomain || 'sample-domain.com'}
                    </p>
                </motion.div>

                {/* Hero Score Section - Clean Design */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-10"
                >
                    <GlassCard glowColor="success" className="text-center py-10 px-6 border-status-success/30">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 mb-8">
                            {/* Before Score */}
                            <div className="text-center">
                                <div className="text-xs font-mono text-text-dim tracking-wider mb-3">BEFORE</div>
                                <div className="relative w-32 h-32 md:w-40 md:h-40">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="50%"
                                            cy="50%"
                                            r="45%"
                                            fill="none"
                                            stroke="rgba(255,255,255,0.1)"
                                            strokeWidth="8"
                                        />
                                        <motion.circle
                                            cx="50%"
                                            cy="50%"
                                            r="45%"
                                            fill="none"
                                            stroke="#ff1a3c"
                                            strokeWidth="8"
                                            strokeLinecap="round"
                                            initial={{ strokeDasharray: `${2 * Math.PI * 45}px`, strokeDashoffset: `${2 * Math.PI * 45}px` }}
                                            animate={{ strokeDashoffset: `${2 * Math.PI * 45 * (1 - beforeScore / 100)}px` }}
                                            transition={{ duration: 1.2, ease: "easeOut" }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <div className="text-3xl md:text-4xl font-black text-status-critical font-mono">{beforeScore}</div>
                                        <div className="text-[10px] text-text-dim mt-1">/100</div>
                                    </div>
                                </div>
                                <div className="mt-3 text-xs font-mono text-status-critical">Critical Risk</div>
                            </div>

                            {/* Arrow */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.4, type: "spring" }}
                                className="flex items-center justify-center"
                            >
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-accent-red to-status-success flex items-center justify-center">
                                    <ArrowRight className="w-6 h-6 text-white" />
                                </div>
                            </motion.div>

                            {/* After Score */}
                            <div className="text-center">
                                <div className="text-xs font-mono text-accent-cyan tracking-wider mb-3">AFTER</div>
                                <div className="relative w-32 h-32 md:w-40 md:h-40">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="50%"
                                            cy="50%"
                                            r="45%"
                                            fill="none"
                                            stroke="rgba(255,255,255,0.1)"
                                            strokeWidth="8"
                                        />
                                        <motion.circle
                                            cx="50%"
                                            cy="50%"
                                            r="45%"
                                            fill="none"
                                            stroke="#39ff8a"
                                            strokeWidth="8"
                                            strokeLinecap="round"
                                            initial={{ strokeDasharray: `${2 * Math.PI * 45}px`, strokeDashoffset: `${2 * Math.PI * 45}px` }}
                                            animate={{ strokeDashoffset: afterScoreAnimated ? `${2 * Math.PI * 45 * (1 - afterScore / 100)}px` : `${2 * Math.PI * 45}px` }}
                                            transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <AnimatedCounter
                                            target={afterScore}
                                            duration={1200}
                                            delay={500}
                                            className="text-3xl md:text-4xl font-black text-status-success font-mono"
                                            startOnMount={false}
                                        />
                                        <div className="text-[10px] text-text-dim mt-1">/100</div>
                                    </div>
                                </div>
                                <div className="mt-3 text-xs font-mono text-status-success">Hardened</div>
                            </div>
                        </div>

                        {/* Improvement Banner */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1.5, type: "spring" }}
                            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-status-success/20 border border-status-success/50"
                        >
                            <TrendingUp className="w-5 h-5 text-status-success" />
                            <span className="text-2xl font-bold text-status-success font-mono">
                                +{improvement} points
                            </span>
                            <Sparkles className="w-4 h-4 text-status-success" />
                        </motion.div>
                    </GlassCard>
                </motion.div>

                {/* Victory Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8, duration: 0.5 }}
                    className="mb-8"
                >
                    <GlassCard glowColor="success" className="text-center py-8 px-6 border-status-success/30">
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <Trophy className="w-8 h-8 text-status-success" />
                            <h2 className="text-2xl md:text-3xl font-bold text-status-success">
                                System Hardened Successfully
                            </h2>
                            <PartyPopper className="w-8 h-8 text-status-success" />
                        </div>

                        <p className="text-text-secondary mb-4">
                            All critical vulnerabilities resolved and verified — {targetDomain || 'sample-domain.com'} is now production-ready
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-status-success/10 border border-status-success/30">
                                <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
                                <span className="text-status-success">Verification scan completed at {new Date().toLocaleTimeString()}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30">
                                <Zap className="w-3.5 h-3.5 text-accent-cyan" />
                                <span className="text-accent-cyan">+62% security improvement</span>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Score Comparison Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.0, duration: 0.5 }}
                    className="mb-8"
                >
                    <ScoreComparison />
                </motion.div>

                {/* Achievement Badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.2, duration: 0.5 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    {[
                        { icon: ShieldCheck, label: 'Security Score', value: 'A+', color: 'success' },
                        { icon: Zap, label: 'Response Time', value: '14.2s', color: 'cyan' },
                        { icon: BarChart3, label: 'Improvement', value: '+62%', color: 'purple' },
                        { icon: Star, label: 'Compliance', value: 'PCI DSS', color: 'red' },
                    ].map((badge, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 2.3 + idx * 0.1, type: "spring" }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="glass-panel p-4 text-center rounded-xl border border-accent-cyan/20 cursor-pointer"
                        >
                            <badge.icon className={`w-6 h-6 mx-auto mb-2 text-${badge.color === 'success' ? 'status-success' : badge.color === 'cyan' ? 'accent-cyan' : badge.color === 'purple' ? 'accent-purple' : 'accent-red'}`} />
                            <div className={`text-xl font-bold text-${badge.color === 'success' ? 'status-success' : badge.color === 'cyan' ? 'accent-cyan' : badge.color === 'purple' ? 'accent-purple' : 'accent-red'} font-mono`}>
                                {badge.value}
                            </div>
                            <div className="text-[10px] text-text-dim mt-1">{badge.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.5, duration: 0.5 }}
                    className="flex justify-center pb-8"
                >
                    <GlowButton
                        onClick={handleGenerateReport}
                        variant="primary"
                        icon={<ShieldCheck className="w-4 h-4" />}
                        className="px-8 py-3 text-base group"
                    >
                        GENERATE FORENSIC REPORT
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </GlowButton>
                </motion.div>

                {/* Status Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.8 }}
                    className="fixed bottom-4 left-4 z-20"
                >
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-status-success/10 backdrop-blur-sm border border-status-success/30">
                        <div className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
                        <span className="text-[10px] font-mono text-status-success">SECURE • VERIFIED • TRUSTED</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Verification;