from sqlalchemy.orm import Session
import datetime
import logging

from .models import models
from .database import SessionLocal

logger = logging.getLogger(__name__)

def seed_database():
    """
    Seed the database with initial data for development and testing.
    """
    db = SessionLocal()
    try:
        # Check if database is already seeded
        if db.query(models.User).count() > 0:
            logger.info("Database already seeded. Skipping.")
            return
        
        logger.info("Seeding database...")
        
        # Create admin user
        admin_user = models.User(
            username="admin",
            email="admin@example.com",
            hashed_password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # "password"
            is_admin=True
        )
        db.add(admin_user)
        
        # Create agencies
        agencies = [
            models.Agency(
                name="FDIC",
                description="Federal Deposit Insurance Corporation - Insures deposits and examines/supervises financial institutions."
            ),
            models.Agency(
                name="OCC",
                description="Office of the Comptroller of the Currency - Charters, regulates, and supervises national banks."
            ),
            models.Agency(
                name="SEC",
                description="Securities and Exchange Commission - Regulates securities markets and protects investors."
            ),
            models.Agency(
                name="FinCEN",
                description="Financial Crimes Enforcement Network - Safeguards the financial system from illicit use."
            ),
            models.Agency(
                name="FRB",
                description="Federal Reserve Board - Conducts monetary policy and supervises banking institutions."
            )
        ]
        
        for agency in agencies:
            db.add(agency)
        
        db.commit()
        
        # Get agency IDs
        fdic = db.query(models.Agency).filter(models.Agency.name == "FDIC").first()
        occ = db.query(models.Agency).filter(models.Agency.name == "OCC").first()
        sec = db.query(models.Agency).filter(models.Agency.name == "SEC").first()
        fincen = db.query(models.Agency).filter(models.Agency.name == "FinCEN").first()
        
        # Create regulations
        regulations = [
            models.Regulation(
                title="Basel III",
                agency_id=fdic.id,
                impact_level=models.ImpactLevel.HIGH,
                last_updated=datetime.datetime(2024, 2, 15),
                summary="Basel III is a global, voluntary regulatory framework on bank capital adequacy, stress testing, and market liquidity risk.",
                category=models.RegulationCategory.CAPITAL
            ),
            models.Regulation(
                title="Dodd-Frank Act",
                agency_id=occ.id,
                impact_level=models.ImpactLevel.MEDIUM,
                last_updated=datetime.datetime(2023, 11, 10),
                summary="The Dodd-Frank Wall Street Reform and Consumer Protection Act is a federal law that regulates the financial industry.",
                category=models.RegulationCategory.RISK
            ),
            models.Regulation(
                title="Volcker Rule",
                agency_id=sec.id,
                impact_level=models.ImpactLevel.HIGH,
                last_updated=datetime.datetime(2024, 1, 20),
                summary="The Volcker Rule restricts banks from making certain speculative investments that do not benefit their customers.",
                category=models.RegulationCategory.RISK
            ),
            models.Regulation(
                title="Fair Lending Practices",
                agency_id=occ.id,
                impact_level=models.ImpactLevel.MEDIUM,
                last_updated=datetime.datetime(2023, 12, 5),
                summary="Regulations ensuring fair and equal access to credit for all Americans, prohibiting discrimination in lending.",
                category=models.RegulationCategory.CONSUMER_PROTECTION
            ),
            models.Regulation(
                title="Anti-Money Laundering (AML)",
                agency_id=fincen.id,
                impact_level=models.ImpactLevel.HIGH,
                last_updated=datetime.datetime(2024, 3, 1),
                summary="Regulations requiring financial institutions to detect and prevent money laundering and terrorist financing.",
                category=models.RegulationCategory.FRAUD
            )
        ]
        
        for regulation in regulations:
            db.add(regulation)
        
        db.commit()
        
        # Get regulation IDs
        basel = db.query(models.Regulation).filter(models.Regulation.title == "Basel III").first()
        dodd_frank = db.query(models.Regulation).filter(models.Regulation.title == "Dodd-Frank Act").first()
        volcker = db.query(models.Regulation).filter(models.Regulation.title == "Volcker Rule").first()
        fair_lending = db.query(models.Regulation).filter(models.Regulation.title == "Fair Lending Practices").first()
        aml = db.query(models.Regulation).filter(models.Regulation.title == "Anti-Money Laundering (AML)").first()
        
        # Create compliance steps
        compliance_steps = [
            # Basel III steps
            models.ComplianceStep(
                regulation_id=basel.id,
                description="Maintain minimum CET1 ratio of 4.5%",
                order=1
            ),
            models.ComplianceStep(
                regulation_id=basel.id,
                description="Implement liquidity coverage ratio (LCR)",
                order=2
            ),
            models.ComplianceStep(
                regulation_id=basel.id,
                description="Conduct stress tests quarterly",
                order=3
            ),
            models.ComplianceStep(
                regulation_id=basel.id,
                description="Report capital adequacy to regulators",
                order=4
            ),
            
            # Dodd-Frank steps
            models.ComplianceStep(
                regulation_id=dodd_frank.id,
                description="Establish risk committee",
                order=1
            ),
            models.ComplianceStep(
                regulation_id=dodd_frank.id,
                description="Implement whistleblower programs",
                order=2
            ),
            models.ComplianceStep(
                regulation_id=dodd_frank.id,
                description="Conduct annual stress tests",
                order=3
            ),
            models.ComplianceStep(
                regulation_id=dodd_frank.id,
                description="Report to Financial Stability Oversight Council",
                order=4
            ),
            
            # Volcker Rule steps
            models.ComplianceStep(
                regulation_id=volcker.id,
                description="Cease proprietary trading activities",
                order=1
            ),
            models.ComplianceStep(
                regulation_id=volcker.id,
                description="Divest from covered funds",
                order=2
            ),
            models.ComplianceStep(
                regulation_id=volcker.id,
                description="Implement compliance program",
                order=3
            ),
            models.ComplianceStep(
                regulation_id=volcker.id,
                description="Report trading activities quarterly",
                order=4
            ),
            
            # Fair Lending steps
            models.ComplianceStep(
                regulation_id=fair_lending.id,
                description="Train staff on fair lending requirements",
                order=1
            ),
            models.ComplianceStep(
                regulation_id=fair_lending.id,
                description="Implement non-discriminatory lending policies",
                order=2
            ),
            models.ComplianceStep(
                regulation_id=fair_lending.id,
                description="Conduct regular audits of lending practices",
                order=3
            ),
            models.ComplianceStep(
                regulation_id=fair_lending.id,
                description="Report lending data to regulators",
                order=4
            ),
            
            # AML steps
            models.ComplianceStep(
                regulation_id=aml.id,
                description="Implement Know Your Customer (KYC) procedures",
                order=1
            ),
            models.ComplianceStep(
                regulation_id=aml.id,
                description="Monitor transactions for suspicious activity",
                order=2
            ),
            models.ComplianceStep(
                regulation_id=aml.id,
                description="File Suspicious Activity Reports (SARs)",
                order=3
            ),
            models.ComplianceStep(
                regulation_id=aml.id,
                description="Conduct regular AML risk assessments",
                order=4
            )
        ]
        
        for step in compliance_steps:
            db.add(step)
        
        # Create banks
        banks = [
            models.Bank(name="JP Morgan Chase"),
            models.Bank(name="Bank of America"),
            models.Bank(name="Wells Fargo"),
            models.Bank(name="Citigroup"),
            models.Bank(name="Goldman Sachs")
        ]
        
        for bank in banks:
            db.add(bank)
        
        db.commit()
        
        # Get bank IDs
        jpmorgan = db.query(models.Bank).filter(models.Bank.name == "JP Morgan Chase").first()
        bofa = db.query(models.Bank).filter(models.Bank.name == "Bank of America").first()
        wells_fargo = db.query(models.Bank).filter(models.Bank.name == "Wells Fargo").first()
        citigroup = db.query(models.Bank).filter(models.Bank.name == "Citigroup").first()
        goldman = db.query(models.Bank).filter(models.Bank.name == "Goldman Sachs").first()
        
        # Associate banks with regulations
        jpmorgan.affected_regulations.extend([basel, volcker])
        bofa.affected_regulations.extend([basel, dodd_frank])
        wells_fargo.affected_regulations.extend([basel, fair_lending])
        citigroup.affected_regulations.extend([basel, aml])
        goldman.affected_regulations.extend([volcker, aml])
        
        # Create compliance alerts
        alerts = [
            models.ComplianceAlert(
                title="Basel III Capital Ratio Reporting Due",
                description="Quarterly capital adequacy report must be submitted to FDIC.",
                due_date=datetime.datetime(2024, 6, 30),
                priority=models.ImpactLevel.HIGH,
                regulation_id=basel.id
            ),
            models.ComplianceAlert(
                title="Annual Stress Test Required",
                description="Dodd-Frank mandated annual stress test submission deadline approaching.",
                due_date=datetime.datetime(2024, 7, 15),
                priority=models.ImpactLevel.MEDIUM,
                regulation_id=dodd_frank.id
            ),
            models.ComplianceAlert(
                title="Volcker Rule Compliance Audit",
                description="Internal audit of Volcker Rule compliance program required.",
                due_date=datetime.datetime(2024, 6, 10),
                priority=models.ImpactLevel.HIGH,
                regulation_id=volcker.id
            ),
            models.ComplianceAlert(
                title="Fair Lending Training Update",
                description="Staff training on updated fair lending requirements needed.",
                due_date=datetime.datetime(2024, 8, 1),
                priority=models.ImpactLevel.MEDIUM,
                regulation_id=fair_lending.id
            ),
            models.ComplianceAlert(
                title="AML Risk Assessment Due",
                description="Quarterly AML risk assessment and report submission required.",
                due_date=datetime.datetime(2024, 6, 30),
                priority=models.ImpactLevel.HIGH,
                regulation_id=aml.id
            )
        ]
        
        for alert in alerts:
            db.add(alert)
        
        # Create regulatory updates
        updates = [
            models.RegulatoryUpdate(
                title="Basel III Liquidity Requirements Updated",
                date=datetime.datetime(2024, 5, 15),
                agency="FDIC",
                description="FDIC has issued updated guidance on liquidity coverage ratio calculations.",
                regulation_id=basel.id
            ),
            models.RegulatoryUpdate(
                title="Dodd-Frank Stress Test Scenarios Released",
                date=datetime.datetime(2024, 5, 10),
                agency="FRB",
                description="Federal Reserve has released scenarios for 2024 stress tests.",
                regulation_id=dodd_frank.id
            ),
            models.RegulatoryUpdate(
                title="Volcker Rule Compliance Deadline Extended",
                date=datetime.datetime(2024, 5, 5),
                agency="SEC",
                description="SEC extends compliance deadline for certain Volcker Rule provisions by 6 months.",
                regulation_id=volcker.id
            ),
            models.RegulatoryUpdate(
                title="New Fair Lending Examination Procedures",
                date=datetime.datetime(2024, 4, 28),
                agency="OCC",
                description="OCC releases updated examination procedures for fair lending compliance.",
                regulation_id=fair_lending.id
            ),
            models.RegulatoryUpdate(
                title="FinCEN Issues New AML Guidance",
                date=datetime.datetime(2024, 4, 20),
                agency="FinCEN",
                description="New guidance on suspicious activity monitoring and reporting for digital assets.",
                regulation_id=aml.id
            )
        ]
        
        for update in updates:
            db.add(update)
        
        db.commit()
        
        logger.info("Database seeded successfully.")
    
    except Exception as e:
        logger.error(f"Error seeding database: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()