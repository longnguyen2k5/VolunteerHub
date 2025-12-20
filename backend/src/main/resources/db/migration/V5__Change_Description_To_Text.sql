ALTER TABLE events
MODIFY COLUMN description TEXT;

-- Also ensuring image_url is 500 chars (consistent with Entity)
ALTER TABLE events
MODIFY COLUMN image_url VARCHAR(500);
