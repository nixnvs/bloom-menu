-- Add translations cache table
CREATE TABLE IF NOT EXISTS translations (
  id SERIAL PRIMARY KEY,
  source_text TEXT NOT NULL,
  source_language VARCHAR(10) NOT NULL,
  target_language VARCHAR(10) NOT NULL,
  translated_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(source_text, source_language, target_language)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_translations_lookup 
ON translations(source_text, source_language, target_language);
