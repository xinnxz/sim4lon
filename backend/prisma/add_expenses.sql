-- Create expenses table with VARCHAR category (simpler approach)
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pangkalan_id UUID NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'OPERASIONAL',
    amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_expenses_pangkalan FOREIGN KEY (pangkalan_id) REFERENCES pangkalans(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_expenses_pangkalan ON expenses(pangkalan_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
