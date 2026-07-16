"""Initial schema database migration

Revision ID: 0001
Revises: 
Create Date: 2026-07-15 03:25:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # No tables created in Phase 2
    pass


def downgrade() -> None:
    # No tables to drop in Phase 2
    pass
