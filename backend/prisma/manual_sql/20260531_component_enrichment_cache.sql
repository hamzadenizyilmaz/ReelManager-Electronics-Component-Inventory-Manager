CREATE TABLE IF NOT EXISTS component_enrichment_cache (
  id INT AUTO_INCREMENT PRIMARY KEY,
  query VARCHAR(255) NOT NULL,
  manufacturer_part_number VARCHAR(255) NULL,
  source VARCHAR(80) NOT NULL,
  raw_response_json JSON NULL,
  normalized_data_json JSON NULL,
  confidence_score DECIMAL(5,2) NULL,
  expires_at DATETIME(3) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX component_enrichment_cache_query_idx (query),
  INDEX component_enrichment_cache_mpn_idx (manufacturer_part_number),
  INDEX component_enrichment_cache_source_idx (source),
  INDEX component_enrichment_cache_expires_at_idx (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
