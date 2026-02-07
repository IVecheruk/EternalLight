-- equipment_condition (справочник)
INSERT INTO gorsvet.equipment_condition (code, name)
VALUES
    ('WORKING', 'Исправное'),
    ('FAULTY', 'Неисправное'),
    ('DISPOSAL', 'На списание')
    ON CONFLICT (code) DO NOTHING;
