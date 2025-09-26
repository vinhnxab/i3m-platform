"""Base model with common fields and functionality."""

import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, String, func
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class BaseModel(Base):
    """Base model with common fields."""
    
    __abstract__ = True
    
    # Primary key
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True
    )
    
    # Multi-tenancy
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        nullable=False,
        index=True
    )
    
    # Audit fields
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )
    
    created_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        nullable=True
    )
    
    updated_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        nullable=True
    )


class SoftDeleteMixin:
    """Mixin for soft delete functionality."""
    
    is_deleted: Mapped[bool] = mapped_column(
        default=False,
        nullable=False,
        index=True
    )
    
    deleted_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
    
    deleted_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        nullable=True
    )
    
    def soft_delete(self, user_id: Optional[uuid.UUID] = None) -> None:
        """Soft delete the record."""
        self.is_deleted = True
        self.deleted_at = datetime.utcnow()
        self.deleted_by = user_id
    
    def restore(self) -> None:
        """Restore the soft-deleted record."""
        self.is_deleted = False
        self.deleted_at = None
        self.deleted_by = None


class StatusMixin:
    """Mixin for status functionality."""
    
    status: Mapped[str] = mapped_column(
        String(50),
        default="active",
        nullable=False,
        index=True
    )
    
    def activate(self) -> None:
        """Activate the record."""
        self.status = "active"
    
    def deactivate(self) -> None:
        """Deactivate the record."""
        self.status = "inactive"


class MetadataMixin:
    """Mixin for metadata fields."""
    
    metadata_: Mapped[Optional[dict]] = mapped_column(
        "metadata",
        JSON,
        nullable=True
    )
    
    tags: Mapped[Optional[list]] = mapped_column(
        JSON,
        nullable=True
    )
    
    notes: Mapped[Optional[str]] = mapped_column(
        String,
        nullable=True
    )
