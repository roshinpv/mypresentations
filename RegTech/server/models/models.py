from sqlalchemy import Column, Integer, String, ForeignKey, Table, DateTime, Text, Boolean, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from ..database import Base

# Association tables for many-to-many relationships
regulation_entity = Table(
    "regulation_entity",
    Base.metadata,
    Column("regulation_id", String, ForeignKey("regulations.id")),
    Column("entity_name", String),
)

bank_regulation = Table(
    "bank_regulation",
    Base.metadata,
    Column("bank_id", String, ForeignKey("banks.id")),
    Column("regulation_id", String, ForeignKey("regulations.id")),
)

class ImpactLevel(str, enum.Enum):
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

class RegulationCategory(str, enum.Enum):
    RISK = "Risk"
    CAPITAL = "Capital"
    CONSUMER_PROTECTION = "Consumer Protection"
    FRAUD = "Fraud"
    OTHER = "Other"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Regulation(Base):
    __tablename__ = "regulations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, index=True)
    agency_id = Column(String, ForeignKey("agencies.id"))
    impact_level = Column(Enum(ImpactLevel), default=ImpactLevel.MEDIUM)
    last_updated = Column(DateTime, default=datetime.utcnow)
    summary = Column(Text)
    category = Column(Enum(RegulationCategory), default=RegulationCategory.OTHER)

    # Relationships
    agency = relationship("Agency", back_populates="regulations")
    compliance_steps = relationship("ComplianceStep", back_populates="regulation", cascade="all, delete-orphan")
    affected_banks = relationship("Bank", secondary=bank_regulation, back_populates="affected_regulations")
    updates = relationship("RegulatoryUpdate", back_populates="regulation", cascade="all, delete-orphan")
    alerts = relationship("ComplianceAlert", back_populates="regulation", cascade="all, delete-orphan")

class ComplianceStep(Base):
    __tablename__ = "compliance_steps"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    regulation_id = Column(String, ForeignKey("regulations.id"))
    description = Column(Text)
    order = Column(Integer)

    # Relationships
    regulation = relationship("Regulation", back_populates="compliance_steps")

class Agency(Base):
    __tablename__ = "agencies"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, unique=True, index=True)
    description = Column(Text)

    # Relationships
    regulations = relationship("Regulation", back_populates="agency")

class Bank(Base):
    __tablename__ = "banks"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, unique=True, index=True)
    
    # Relationships
    affected_regulations = relationship("Regulation", secondary=bank_regulation, back_populates="affected_banks")

class ComplianceAlert(Base):
    __tablename__ = "compliance_alerts"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String)
    description = Column(Text)
    due_date = Column(DateTime)
    priority = Column(Enum(ImpactLevel), default=ImpactLevel.MEDIUM)
    regulation_id = Column(String, ForeignKey("regulations.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    regulation = relationship("Regulation", back_populates="alerts")

class RegulatoryUpdate(Base):
    __tablename__ = "regulatory_updates"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String)
    date = Column(DateTime, default=datetime.utcnow)
    agency = Column(String)
    description = Column(Text)
    regulation_id = Column(String, ForeignKey("regulations.id"))

    # Relationships
    regulation = relationship("Regulation", back_populates="updates")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    content = Column(Text)
    sender = Column(String)  # 'user' or 'bot'
    timestamp = Column(DateTime, default=datetime.utcnow)
    user_id = Column(String, ForeignKey("users.id"))

class Citation(Base):
    __tablename__ = "citations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    message_id = Column(String, ForeignKey("chat_messages.id"))
    regulation_id = Column(String, ForeignKey("regulations.id"))
    text = Column(Text)