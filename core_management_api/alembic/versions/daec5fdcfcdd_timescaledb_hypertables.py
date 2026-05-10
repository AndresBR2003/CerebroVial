"""timescaledb hypertables

Revision ID: daec5fdcfcdd
Revises: 775d2d1db8b4
Create Date: 2026-05-04 10:27:17.753489

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'daec5fdcfcdd'
down_revision: Union[str, Sequence[str], None] = '775d2d1db8b4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        "SELECT create_hypertable('waze_jams', 'snapshot_timestamp', "
        "chunk_time_interval => INTERVAL '1 day', if_not_exists => TRUE);"
    )
    op.execute(
        "SELECT create_hypertable('waze_alerts', 'timestamp', "
        "chunk_time_interval => INTERVAL '1 day', if_not_exists => TRUE);"
    )
    op.execute(
        "SELECT create_hypertable('vision_tracks', 'entry_timestamp', "
        "chunk_time_interval => INTERVAL '1 day', if_not_exists => TRUE);"
    )
    op.execute(
        "SELECT create_hypertable('vision_flows', 'timestamp_bin', "
        "chunk_time_interval => INTERVAL '1 day', if_not_exists => TRUE);"
    )


def downgrade() -> None:
    # TimescaleDB no soporta convertir una hypertable de vuelta a tabla regular
    # sin recrearla desde cero. En dev, usar `docker compose down -v` si se
    # necesita revertir completamente.
    pass
