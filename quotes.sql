CREATE TABLE quotes (
    id SERIAL PRIMARY KEY,
    quote VARCHAR NOT NULL,
    author VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO quotes (quote,author) VALUES ('If you don’t believe it or don’t get it, I don’t have the time to try to convince you, sorry.','Satoshi Nakamoto');