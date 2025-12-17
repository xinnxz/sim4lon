-- Create pangkalan_stocks table
CREATE TABLE IF NOT EXISTS pangkalan_stocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pangkalan_id UUID NOT NULL,
    lpg_type lpg_type NOT NULL,
    qty INT NOT NULL DEFAULT 0,
    warning_level INT NOT NULL DEFAULT 20,
    critical_level INT NOT NULL DEFAULT 10,
    created_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_pangkalan_stocks_pangkalan FOREIGN KEY (pangkalan_id) REFERENCES pangkalans(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Create unique constraint
CREATE UNIQUE INDEX IF NOT EXISTS idx_pangkalan_stocks_unique ON pangkalan_stocks(pangkalan_id, lpg_type);
CREATE INDEX IF NOT EXISTS idx_pangkalan_stocks_pangkalan ON pangkalan_stocks(pangkalan_id);

-- Create pangkalan_stock_movements table
CREATE TABLE IF NOT EXISTS pangkalan_stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pangkalan_id UUID NOT NULL,
    lpg_type lpg_type NOT NULL,
    movement_type VARCHAR(20) NOT NULL,
    qty INT NOT NULL,
    source VARCHAR(50),
    reference_id UUID,
    note TEXT,
    movement_date TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_pangkalan_stock_movements_pangkalan FOREIGN KEY (pangkalan_id) REFERENCES pangkalans(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_pangkalan_stock_movements_pangkalan ON pangkalan_stock_movements(pangkalan_id);
CREATE INDEX IF NOT EXISTS idx_pangkalan_stock_movements_date ON pangkalan_stock_movements(movement_date DESC);
CREATE INDEX IF NOT EXISTS idx_pangkalan_stock_movements_lpg ON pangkalan_stock_movements(lpg_type);
