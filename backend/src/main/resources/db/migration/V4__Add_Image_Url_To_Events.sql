ALTER TABLE events
ADD COLUMN image_url VARCHAR(500);

-- Cập nhật ảnh mẫu cho các sự kiện
UPDATE events
SET image_url = CASE MOD(id, 8)
    WHEN 1 THEN 'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    WHEN 2 THEN 'https://plus.unsplash.com/premium_photo-1664300347812-00e2b09646c5?q=80&w=916&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    WHEN 3 THEN 'https://images.unsplash.com/photo-1557660559-42497f78035b?q=80&w=1546&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    WHEN 4 THEN 'https://images.unsplash.com/photo-1593113616828-6f22bca04804?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    WHEN 5 THEN 'https://images.unsplash.com/photo-1616680214084-22670de1bc82?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    WHEN 6 THEN 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    WHEN 7 THEN 'https://images.unsplash.com/photo-1764738130349-216aa4eabf99?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    ELSE 'https://images.unsplash.com/photo-1723754619302-1c9aeb837d6c?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' 
END;
