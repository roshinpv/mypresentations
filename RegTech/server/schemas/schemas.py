from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

# Enums
class ImpactLevel(str, Enum):
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

class RegulationCategory(str, Enum):
    RISK = "Risk"
    CAPITAL = "Capital"
    CONSUMER_PROTECTION = "Consumer Protection"
    FRAUD = "Fraud"
    OTHER = "Other"

# Base schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr
    is_admin: bool = False

class RegulationBase(BaseModel):
    title: str
    agency_id: str
    impact_level: ImpactLevel
    summary: str
    category: RegulationCategory

class AgencyBase(BaseModel):
    name: str
    description: str

class BankBase(BaseModel):
    name: str

class ComplianceStepBase(BaseModel):
    description: str
    order: int

class ComplianceAlertBase(BaseModel):
    title: str
    description: str
    due_date: datetime
    priority: ImpactLevel
    regulation_id: str

class RegulatoryUpdateBase(BaseModel):
    title: str
    date: datetime
    agency: str
    description: str
    regulation_id: str

class ChatMessageBase(BaseModel):
    content: str
    sender: str  # 'user' or 'bot'

class CitationBase(BaseModel):
    regulation_id: str
    text: str

# Create schemas
class UserCreate(UserBase):
    password: str

class RegulationCreate(RegulationBase):
    compliance_steps: List[ComplianceStepBase] = []
    affected_bank_ids: List[str] = []

class AgencyCreate(AgencyBase):
    pass

class BankCreate(BankBase):
    pass

class ComplianceStepCreate(ComplianceStepBase):
    regulation_id: str

class ComplianceAlertCreate(ComplianceAlertBase):
    pass

class RegulatoryUpdateCreate(RegulatoryUpdateBase):
    pass

class ChatMessageCreate(ChatMessageBase):
    user_id: str
    citations: List[CitationBase] = []

# Read schemas
class ComplianceStep(ComplianceStepBase):
    id: str
    regulation_id: str

    class Config:
        orm_mode = True

class Citation(CitationBase):
    id: str
    message_id: str

    class Config:
        orm_mode = True

class ChatMessage(ChatMessageBase):
    id: str
    timestamp: datetime
    user_id: str
    citations: List[Citation] = []

    class Config:
        orm_mode = True

class RegulatoryUpdate(RegulatoryUpdateBase):
    id: str

    class Config:
        orm_mode = True

class ComplianceAlert(ComplianceAlertBase):
    id: str
    created_at: datetime

    class Config:
        orm_mode = True

class Bank(BankBase):
    id: str
    affected_regulation_ids: List[str] = []

    class Config:
        orm_mode = True

class Agency(AgencyBase):
    id: str
    regulation_ids: List[str] = []

    class Config:
        orm_mode = True

class Regulation(RegulationBase):
    id: str
    last_updated: datetime
    compliance_steps: List[ComplianceStep] = []
    affected_banks: List[Bank] = []
    updates: List[RegulatoryUpdate] = []
    alerts: List[ComplianceAlert] = []

    class Config:
        orm_mode = True

class User(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Graph schemas
class GraphNode(BaseModel):
    id: str
    label: str
    type: str

class GraphLink(BaseModel):
    source: str
    target: str
    label: str

class GraphData(BaseModel):
    nodes: List[GraphNode]
    links: List[GraphLink]

# AI Assistant schemas
class AssistantQuery(BaseModel):
    query: str
    user_id: str

class AssistantResponse(BaseModel):
    response: str
    citations: List[Citation] = []