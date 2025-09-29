"""Database configuration and connection management."""

import asyncio
from typing import AsyncGenerator, Dict, Any

import structlog
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings

logger = structlog.get_logger(__name__)


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models."""
    pass


# Create async engine
engine = create_async_engine(
    settings.DATABASE_URL,
    pool_size=settings.DATABASE_POOL_SIZE,
    max_overflow=settings.DATABASE_MAX_OVERFLOW,
    pool_pre_ping=settings.DATABASE_POOL_PRE_PING,
    echo=settings.DATABASE_ECHO,
)

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency to get database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db() -> None:
    """Initialize database connection."""
    try:
        async with engine.begin() as conn:
            # Create all tables
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error("Failed to initialize database", error=str(e))
        raise


async def close_db() -> None:
    """Close database connection."""
    try:
        await engine.dispose()
        logger.info("Database connection closed")
    except Exception as e:
        logger.error("Error closing database connection", error=str(e))


async def health_check() -> bool:
    """Check database health."""
    try:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
            return True
    except Exception as e:
        logger.error("Database health check failed", error=str(e))
        return False


async def get_db_stats() -> Dict[str, Any]:
    """Get database statistics."""
    try:
        async with AsyncSessionLocal() as session:
            # Get database version
            result = await session.execute(text("SELECT version()"))
            version = result.scalar()
            
            # Get connection info
            pool = engine.pool
            
            return {
                "version": version,
                "pool_size": pool.size(),
                "checked_in": pool.checkedin(),
                "checked_out": pool.checkedout(),
                "overflow": pool.overflow(),
            }
    except Exception as e:
        logger.error("Failed to get database stats", error=str(e))
        return {
            "status": "error",
            "error": str(e)
        }


# Connection event handlers
async def on_startup():
    """Database startup handler."""
    logger.info("Connecting to database", url=settings.DATABASE_URL.split("@")[-1])
    try:
        await init_db()
        logger.info("Database connected successfully")
    except Exception as e:
        logger.error("Database connection failed", error=str(e))
        raise


async def on_shutdown():
    """Database shutdown handler."""
    logger.info("Closing database connections")
    await close_db()
