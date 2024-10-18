CREATE TABLE kamikazeekaraoke.users(
    username VARCHAR(45) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(80) NOT NULL,
    last_name VARCHAR(80) NOT NULL,
    security_question LONGTEXT NOT NULL,
    security_answer LONGTEXT NOT NULL,
    birth_date VARCHAR(255) NOT NULL,
    admin BOOLEAN DEFAULT FALSE,
    PRIMARY KEY(username) 
);

CREATE TABLE kamikazeekaraoke.songs(
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(600) NOT NULL,
    artist VARCHAR(600) NOT NULL,
    release_year INT(255) NOT NULL,
    genre VARCHAR(600) NOT NULL,
    confirmed_genre BOOLEAN DEFAULT FALSE,
    link VARCHAR(1500),
    confirmed_link BOOLEAN DEFAULT FALSE,
    lyrics LONGTEXT,
    PRIMARY KEY(id)
);

CREATE TABLE kamikazeekaraoke.favorited(
    username VARCHAR(45) NOT NULL,
    song_id INT NOT NULL,
    PRIMARY(username, song_id)
    FOREIGN KEY (username)
        REFERENCES users(username)
    FOREIGN KEY (song_id)
        REFERENCES songs(id)
);
