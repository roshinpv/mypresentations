from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import logging

from ..database import get_db
from ..models import models
from ..schemas import schemas
from ..dependencies import get_current_user

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/query", response_model=schemas.AssistantResponse)
async def query_assistant(
    query: schemas.AssistantQuery,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    # Log the query
    logger.info(f"User {query.user_id} asked: {query.query}")
    
    # Save user message to database
    user_message = models.ChatMessage(
        content=query.query,
        sender="user",
        user_id=query.user_id
    )
    db.add(user_message)
    db.commit()
    db.refresh(user_message)
    
    # Generate response (this is a mock implementation)
    # In a real application, this would call an LLM API
    response, citations = generate_response(query.query, db)
    
    # Save bot message to database
    bot_message = models.ChatMessage(
        content=response,
        sender="bot",
        user_id=query.user_id
    )
    db.add(bot_message)
    db.commit()
    db.refresh(bot_message)
    
    # Save citations
    db_citations = []
    for citation in citations:
        db_citation = models.Citation(
            message_id=bot_message.id,
            regulation_id=citation["regulation_id"],
            text=citation["text"]
        )
        db.add(db_citation)
        db_citations.append({
            "regulation_id": citation["regulation_id"],
            "text": citation["text"]
        })
    
    db.commit()
    
    return {
        "response": response,
        "citations": db_citations
    }

@router.get("/history/{user_id}", response_model=List[schemas.ChatMessage])
async def get_chat_history(
    user_id: str,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    # Ensure the user is requesting their own history or is an admin
    if current_user.id != user_id and not current_user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to view this chat history"
        )
    
    messages = db.query(models.ChatMessage).filter(
        models.ChatMessage.user_id == user_id
    ).order_by(models.ChatMessage.timestamp.desc()).limit(limit).all()
    
    # Reverse to get chronological order
    messages.reverse()
    
    # Get citations for bot messages
    for message in messages:
        if message.sender == "bot":
            citations = db.query(models.Citation).filter(
                models.Citation.message_id == message.id
            ).all()
            message.citations = citations
    
    return messages

@router.delete("/history/{user_id}")
async def clear_chat_history(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    # Ensure the user is clearing their own history or is an admin
    if current_user.id != user_id and not current_user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to clear this chat history"
        )
    
    # Delete all messages for this user
    db.query(models.ChatMessage).filter(
        models.ChatMessage.user_id == user_id
    ).delete()
    
    db.commit()
    
    return {"message": "Chat history cleared successfully"}

def generate_response(query: str, db: Session) -> tuple[str, List[Dict[str, Any]]]:
    """
    Generate a response to the user's query.
    This is a mock implementation that returns predefined responses based on keywords.
    In a real application, this would call an LLM API.
    
    Args:
        query: The user's query
        db: Database session
    
    Returns:
        Tuple of (response text, list of citations)
    """
    query_lower = query.lower()
    citations = []
    
    # Basel III / Capital requirements
    if any(term in query_lower for term in ["basel", "capital", "tier 1", "cet1"]):
        response = "Basel III establishes minimum capital requirements for banks. The key components include Common Equity Tier 1 (CET1) ratio of 4.5%, Tier 1 capital ratio of 6%, and total capital ratio of 8%. Additionally, banks must maintain a capital conservation buffer of 2.5% and potentially a countercyclical buffer of up to 2.5%."
        
        # Find Basel III regulation
        regulation = db.query(models.Regulation).filter(
            models.Regulation.title.ilike("%basel%")
        ).first()
        
        if regulation:
            citations.append({
                "regulation_id": regulation.id,
                "text": "Basel III requires implementation of capital adequacy ratios"
            })
    
    # Liquidity requirements
    elif any(term in query_lower for term in ["liquidity", "lcr", "nsfr"]):
        response = "The Liquidity Coverage Ratio (LCR) requires banks to maintain sufficient high-quality liquid assets to cover their total net cash outflows over a 30-day stress period. The Net Stable Funding Ratio (NSFR) requires banks to maintain a stable funding profile in relation to their on and off-balance sheet activities."
        
        # Find Basel III regulation (which includes liquidity requirements)
        regulation = db.query(models.Regulation).filter(
            models.Regulation.title.ilike("%basel%")
        ).first()
        
        if regulation:
            citations.append({
                "regulation_id": regulation.id,
                "text": "Basel III requires implementation of liquidity coverage ratio (LCR)"
            })
    
    # Volcker Rule
    elif "volcker" in query_lower:
        response = "The Volcker Rule prohibits banks from engaging in proprietary trading and limits their investments in hedge funds and private equity funds. Banks must establish compliance programs to ensure they are not engaging in prohibited activities."
        
        # Find Volcker Rule regulation
        regulation = db.query(models.Regulation).filter(
            models.Regulation.title.ilike("%volcker%")
        ).first()
        
        if regulation:
            citations.append({
                "regulation_id": regulation.id,
                "text": "Volcker Rule prohibits proprietary trading"
            })
    
    # AML / Money Laundering
    elif any(term in query_lower for term in ["aml", "money laundering", "kyc"]):
        response = "Anti-Money Laundering (AML) regulations require financial institutions to implement Know Your Customer (KYC) procedures, monitor transactions for suspicious activity, and report suspicious transactions to the appropriate authorities."
        
        # Find AML regulation
        regulation = db.query(models.Regulation).filter(
            models.Regulation.title.ilike("%money laundering%") | 
            models.Regulation.title.ilike("%aml%")
        ).first()
        
        if regulation:
            citations.append({
                "regulation_id": regulation.id,
                "text": "AML regulations require KYC procedures and suspicious activity monitoring"
            })
    
    # Bank-specific query
    elif any(bank_name.lower() in query_lower for bank_name in ["jp morgan", "bank of america", "wells fargo", "citigroup", "goldman sachs"]):
        # Extract bank name from query
        bank_names = ["jp morgan", "bank of america", "wells fargo", "citigroup", "goldman sachs"]
        bank_name = next((name for name in bank_names if name in query_lower), None)
        
        if bank_name:
            # Find bank in database
            bank = db.query(models.Bank).filter(
                models.Bank.name.ilike(f"%{bank_name}%")
            ).first()
            
            if bank:
                affected_regs = [reg.title for reg in bank.affected_regulations]
                affected_regs_str = ", ".join(affected_regs) if affected_regs else "no specific regulations"
                
                response = f"{bank.name} is affected by {affected_regs_str}. As a Global Systemically Important Bank (G-SIB), it is subject to enhanced regulatory requirements including higher capital buffers, stress testing, and resolution planning."
                
                # Add citations for affected regulations
                for reg in bank.affected_regulations:
                    citations.append({
                        "regulation_id": reg.id,
                        "text": f"{reg.title} affects {bank.name}"
                    })
            else:
                response = f"I don't have specific information about {bank_name} in my database."
        else:
            response = "I don't have specific information about that bank in my database."
    
    # Default response
    else:
        response = "I'm your AI Compliance Assistant. I can help answer questions about banking regulations, compliance requirements, and regulatory impacts. Please ask a specific question about a regulation or compliance topic."
    
    return response, citations