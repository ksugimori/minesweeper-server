CREATE TABLE games (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  width INT NOT NULL,
  height INT NOT NULL,
  status VARCHAR(10) DEFAULT 'INIT',
  mines JSON NOT NULL DEFAULT ('[]'),
  opens JSON NOT NULL DEFAULT ('[]'),
  flags JSON NOT NULL DEFAULT ('[]')
);

INSERT INTO games (width, height, status, mines) VALUES (2, 2, 'INIT', '[{"x": 0, "y": 0}, {"x": 1, "y": 1}]');
INSERT INTO games (width, height, status, mines) VALUES (2, 2, 'INIT', '[{"x": 0, "y": 0}]');