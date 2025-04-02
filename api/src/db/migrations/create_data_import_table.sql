-- Create data_import table
CREATE TABLE IF NOT EXISTS data_import (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    source VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    import_batch_id VARCHAR(100) NOT NULL,
    original_payload JSONB NOT NULL,
    processed_data JSONB,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    error_message TEXT,
    metadata JSONB,
    selected_locations TEXT[],
    import_limit INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'system',
    updated_by VARCHAR(100) DEFAULT 'system'
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_data_import_batch_id ON data_import(import_batch_id);
CREATE INDEX IF NOT EXISTS idx_data_import_source ON data_import(source);
CREATE INDEX IF NOT EXISTS idx_data_import_category ON data_import(category);
CREATE INDEX IF NOT EXISTS idx_data_import_status ON data_import(status);
CREATE INDEX IF NOT EXISTS idx_data_import_created_at ON data_import(created_at);

-- Add comments
COMMENT ON TABLE data_import IS 'Stores import data and metadata from various sources';
COMMENT ON COLUMN data_import.source IS 'Source of the data (e.g., VIATOR_API)';
COMMENT ON COLUMN data_import.category IS 'Category of the imported data (e.g., TOURS)';
COMMENT ON COLUMN data_import.import_batch_id IS 'Unique identifier for the import batch';
COMMENT ON COLUMN data_import.original_payload IS 'Original response data from the source';
COMMENT ON COLUMN data_import.processed_data IS 'Processed/transformed data';
COMMENT ON COLUMN data_import.status IS 'Status of the import (PENDING, PROCESSING, COMPLETED, FAILED)';
COMMENT ON COLUMN data_import.error_message IS 'Error message if import failed';
COMMENT ON COLUMN data_import.metadata IS 'Additional metadata about the import';
COMMENT ON COLUMN data_import.selected_locations IS 'Array of location IDs selected for import';
COMMENT ON COLUMN data_import.import_limit IS 'Limit of items per location for import'; 