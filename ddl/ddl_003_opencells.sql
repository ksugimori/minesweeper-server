CREATE TABLE open_cells (
  gameId INT NOT NULL,
  x INT NOT NULL,
  y INT NOT NULL,
  PRIMARY KEY (gameId, x, y),
  FOREIGN KEY parent (gameId) REFERENCES games (id) ON DELETE CASCADE
);