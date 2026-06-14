import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

// Vulnerability data shared across the app
export const vulnerabilitiesData = [
  {
    id: 'SEC-001',
    title: 'Missing Content-Security-Policy Header',
    severity: 'HIGH',
    description: 'No CSP header detected, allowing arbitrary script execution',
    cvss: '7.2',
    location: 'HTTP Headers',
    impact: 'Attackers can inject malicious scripts',
    fix: 'Add CSP header: default-src \'self\'; script-src \'self\' cdnjs.cloudflare.com',
  },
  {
    id: 'SEC-002',
    title: 'Missing Strict-Transport-Security Header',
    severity: 'MEDIUM',
    description: 'HSTS not enforced, allowing protocol downgrade',
    cvss: '5.8',
    location: 'HTTP Headers',
    impact: 'Man-in-the-middle attacks possible',
    fix: 'Add HSTS header: max-age=31536000; includeSubDomains',
  },
  {
    id: 'SEC-003',
    title: 'Directory Listing Enabled',
    severity: 'HIGH',
    description: '/backup/ directory exposes file listing to any visitor',
    cvss: '7.5',
    location: 'Web Server Config',
    impact: 'Sensitive file exposure',
    fix: 'Disable directory listing in web server config',
  },
  {
    id: 'SEC-004',
    title: 'Outdated TLS Configuration',
    severity: 'CRITICAL',
    description: 'TLS 1.0 still enabled — vulnerable to known protocol attacks',
    cvss: '8.1',
    location: 'SSL/TLS Config',
    impact: 'Connection decryption possible',
    fix: 'Disable TLS 1.0/1.1, enable TLS 1.2/1.3',
  },
];

// Available sections for navigation
export const sections = {
  LANDING: 'landing',
  SCAN_INIT: 'scanInit',
  THREAT_DASHBOARD: 'threatDashboard',
  AI_ANALYSIS: 'aiAnalysis',
  REMEDIATION: 'remediation',
  VERIFICATION: 'verification',
  FORENSIC_REPORT: 'forensicReport',
  FUTURE_VISION: 'futureVision',
  USER_DASHBOARD: 'userDashboard',
};

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  // Navigation state
  const [currentSection, setCurrentSection] = useState(sections.LANDING);

  // Security data
  const [securityScore, setSecurityScore] = useState({ before: 58, after: 94 });
  const [vulnerabilities, setVulnerabilities] = useState(vulnerabilitiesData);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [selectedVulnerabilityId, setSelectedVulnerabilityId] = useState(null);

  // Scan data
  const [scanData, setScanData] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [remediationStatus, setRemediationStatus] = useState(null);
  const [verificationData, setVerificationData] = useState(null);
  const [reportData, setReportData] = useState(null);

  // Scan progress
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Mission Setup Data
  const [targetDomain, setTargetDomain] = useState('');
  const [deploymentLink, setDeploymentLink] = useState('');
  const [scanProfile, setScanProfile] = useState('standard');

  // Scan history — persisted to localStorage
  const [scanHistory, setScanHistory] = useState(() => {
    try {
      const stored = localStorage.getItem('sentinel_scan_history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Navigation functions
  const goToSection = useCallback((sectionName) => {
    if (Object.values(sections).includes(sectionName)) {
      setCurrentSection(sectionName);
    } else {
      console.error(`Invalid section: ${sectionName}`);
    }
  }, []);

  const selectVulnerability = useCallback((id) => {
    setSelectedVulnerabilityId(id);
  }, []);

  const markRemediationComplete = useCallback(() => {
    setResolvedCount(4);
  }, []);

  // Persist scanHistory whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('sentinel_scan_history', JSON.stringify(scanHistory));
    } catch {
      // storage quota exceeded — silently ignore
    }
  }, [scanHistory]);

  // Load scan history from MongoDB with localStorage fallback
  const loadScanHistory = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8002/history/default_user');
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      const data = await response.json();
      if (data && data.success && Array.isArray(data.scans)) {
        // Map from snake_case database schema back to camelCase frontend model
        const mappedScans = data.scans.map(scan => ({
          id: scan.scan_id,
          domain: scan.domain,
          deploymentUrl: scan.deployment_url,
          scannedAt: scan.scanned_at,
          highestSeverity: scan.highest_severity,
          totalVulnerabilities: scan.total_vulnerabilities,
          resolvedVulnerabilities: scan.resolved_vulnerabilities,
          scoreBefore: scan.score_before,
          scoreAfter: scan.score_after,
          status: scan.status,
          findings: scan.findings || [],
          analysis: scan.analysis || [],
        }));
        setScanHistory(mappedScans);
        console.log('Successfully loaded scan history from MongoDB:', mappedScans.length);
      }
    } catch (err) {
      console.error('Failed to load scan history from MongoDB, using localStorage fallback:', err);
    }
  }, []);

  // Fetch history on initial load
  useEffect(() => {
    loadScanHistory();
  }, [loadScanHistory]);

  // Save the current completed scan to history
  const saveScanToHistory = useCallback(async () => {
    // Derive highest severity from scanData findings
    const findingsList = scanData?.findings || scanData?.originalFindings || [];
    const severityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
    const highestSeverity = findingsList.reduce((max, f) => {
      const sev = (f.severity || '').toUpperCase();
      return (severityOrder[sev] || 0) > (severityOrder[max] || 0) ? sev : max;
    }, 'LOW');

    const entry = {
      id: 'SNT-' + Date.now(),
      domain: targetDomain || 'Unknown',
      deploymentUrl: deploymentLink || '',
      scannedAt: new Date().toISOString(),
      highestSeverity,
      totalVulnerabilities: scanData?.total_findings ?? findingsList.length,
      resolvedVulnerabilities: resolvedCount,
      scoreBefore: securityScore.before,
      scoreAfter: securityScore.after,
      status: 'completed',
      findings: findingsList,
      analysis: aiAnalysis?.analysis || [],
    };

    // Optimistically update React state (will automatically sync to localStorage via useEffect)
    setScanHistory(prev => [...prev, entry]);

    // Send POST request to MongoDB backend
    try {
      const payload = {
        scan_id: entry.id,
        user_id: 'default_user',
        domain: entry.domain,
        deployment_url: entry.deploymentUrl,
        scanned_at: entry.scannedAt,
        highest_severity: entry.highestSeverity,
        total_vulnerabilities: entry.totalVulnerabilities,
        resolved_vulnerabilities: entry.resolvedVulnerabilities,
        score_before: entry.scoreBefore,
        score_after: entry.scoreAfter,
        status: entry.status,
        findings: entry.findings.map(f => ({
          id: f.id,
          title: f.title,
          severity: f.severity || 'LOW',
          description: f.description,
          evidence: f.evidence,
          location: f.location,
        })),
        analysis: Array.isArray(entry.analysis) ? entry.analysis.map(a => ({
          id: a.id,
          title: a.title,
          severity: a.severity,
          explanation: a.explanation,
          impact: a.impact,
          recommended_fix: a.recommended_fix || a.fix || a.recommendedFix,
          code_snippet: a.code_snippet || a.codeSnippet,
          confidence: a.confidence,
        })) : [],
      };

      const response = await fetch('http://localhost:8002/history/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      console.log('Successfully saved scan history to MongoDB');
    } catch (err) {
      console.error('Failed to save scan history to MongoDB, local fallback active:', err);
    }
  }, [scanData, targetDomain, deploymentLink, resolvedCount, securityScore, aiAnalysis]);

  const resetApp = useCallback(() => {
    setCurrentSection(sections.LANDING);
    setResolvedCount(0);
    setSelectedVulnerabilityId(null);
    setScanData(null);
    setAiAnalysis(null);
    setRemediationStatus(null);
    setVerificationData(null);
    setReportData(null);
    setIsScanning(false);
    setScanProgress(0);
    setTargetDomain('');
    setDeploymentLink('');
    setScanProfile('standard');
    // Note: scanHistory is intentionally NOT cleared on reset — it persists across sessions
  }, []);

  const value = {
    // Navigation
    currentSection,
    goToSection,

    // Security Data
    securityScore,
    setSecurityScore,
    vulnerabilities,
    setVulnerabilities,
    resolvedCount,
    setResolvedCount,
    selectedVulnerabilityId,
    setSelectedVulnerabilityId,
    selectVulnerability,

    // Scan Data
    scanData,
    setScanData,
    aiAnalysis,
    setAiAnalysis,
    remediationStatus,
    setRemediationStatus,
    verificationData,
    setVerificationData,
    reportData,
    setReportData,

    // Progress
    isScanning,
    setIsScanning,
    scanProgress,
    setScanProgress,

    // Mission Setup
    targetDomain,
    setTargetDomain,
    deploymentLink,
    setDeploymentLink,
    scanProfile,
    setScanProfile,

    // Scan History
    scanHistory,
    setScanHistory,
    saveScanToHistory,
    loadScanHistory,

    // Actions
    markRemediationComplete,
    resetApp,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};