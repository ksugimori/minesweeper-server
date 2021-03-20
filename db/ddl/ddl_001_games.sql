CREATE TABLE games (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  width INT NOT NULL,
  height INT NOT NULL,
  status VARCHAR(10) DEFAULT 'INIT'
);

INSERT INTO games (width, height, status) VALUES (9, 9, 'INIT');