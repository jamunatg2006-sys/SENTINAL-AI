from pydantic import BaseModel
from typing import List, Optional


class FindingModel(BaseModel):
    id: Optional[str] = None
    title: Optional[str] = None
    severity: str = "LOW"
    description: Optional[str] = None
    evidence: Optional[str] = None
    location: Optional[str] = None

    class Config:
        extra = "allow"  # tolerate extra fields from real scanner output


class AnalysisModel(BaseModel):
    id: Optional[str] = None
    title: Optional[str] = None
    severity: Optional[str] = None
    explanation: Optional[str] = None
    impact: Optional[str] = None
    recommended_fix: Optional[str] = None
    code_snippet: Optional[str] = None
    confidence: Optional[int] = None

    class Config:
        extra = "allow"


class ScanHistoryEntry(BaseModel):
    scan_id: str
    user_id: str = "default_user"
    domain: str
    deployment_url: Optional[str] = None
    scanned_at: str
    highest_severity: str = "LOW"
    total_vulnerabilities: int = 0
    resolved_vulnerabilities: int = 0
    score_before: int = 0
    score_after: int = 0
    status: str = "completed"
    findings: List[FindingModel] = []
    analysis: List[AnalysisModel] = []

    class Config:
        extra = "allow"


class SaveScanRequest(BaseModel):
    scan_id: str
    user_id: str = "default_user"
    domain: str
    deployment_url: Optional[str] = None
    scanned_at: str
    highest_severity: str = "LOW"
    total_vulnerabilities: int = 0
    resolved_vulnerabilities: int = 0
    score_before: int = 0
    score_after: int = 0
    status: str = "completed"
    findings: List[FindingModel] = []
    analysis: List[AnalysisModel] = []

    class Config:
        extra = "allow"


class ScanHistoryResponse(BaseModel):
    success: bool
    message: str
    scan_id: Optional[str] = None


class GetHistoryResponse(BaseModel):
    success: bool
    user_id: str
    total_scans: int
    scans: List[ScanHistoryEntry]
