"""merge multiple heads

Revision ID: 768cd23c485a
Revises: 36357487ff9e, dcc434a45159
Create Date: 2026-06-18 16:18:24.901278

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '768cd23c485a'
down_revision: Union[str, Sequence[str], None] = ('36357487ff9e', 'dcc434a45159')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
