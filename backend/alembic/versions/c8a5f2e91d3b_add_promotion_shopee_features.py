"""add promotion shopee features

Revision ID: c8a5f2e91d3b
Revises: d7ee620add1a
Create Date: 2026-07-22 01:55:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c8a5f2e91d3b'
down_revision: str = 'd7ee620add1a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Thêm cột mới vào bảng promotions
    op.add_column('promotions', sa.Column('max_discount_amount', sa.Float(), nullable=True))
    op.add_column('promotions', sa.Column('usage_limit', sa.Integer(), nullable=True))
    op.add_column('promotions', sa.Column('usage_count', sa.Integer(), server_default='0', nullable=False))
    op.add_column('promotions', sa.Column('usage_limit_per_user', sa.Integer(), server_default='1', nullable=False))
    op.add_column('promotions', sa.Column('start_date', sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    op.drop_column('promotions', 'start_date')
    op.drop_column('promotions', 'usage_limit_per_user')
    op.drop_column('promotions', 'usage_count')
    op.drop_column('promotions', 'usage_limit')
    op.drop_column('promotions', 'max_discount_amount')
