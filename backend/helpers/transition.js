const songs = require("./songData.js");
const db = require("../db.js");

const transition = async() => {
    let query = 
`INSERT INTO 
    songs(title, artist, release_year, genre, confirmed_genre, link, confirmed_link, lyrics) 
VALUES 
    `; 
    for(let i = 0; i < songs.length; i++){
        s = {
            "title": songs[i].title,
            "artist": songs[i].artist,
            "release_year": songs[i].release ? parseInt(songs[i].release) : 0000,
            "genre": songs[i].genre !== null ? songs[i].genre : "TBD",
        }
        if(i === songs.length - 1){
            query += 
    `("${s.title}", "${s.artist}", ${s.release_year}, "${s.genre}", ${false}, ${null}, ${false}, ${null});`
        } else {
            query += 
    `("${s.title}", "${s.artist}", ${s.release_year}, "${s.genre}", ${false}, ${null}, ${false}, ${null}), 
    `;
        }
    }
    // console.log(query)
    await db.query(query, (err, results) => {
        if(err){
            const error = {
                "error":err
            }
            console.log(error)
        }
        if(results){
            console.log(results);
        }
    }); 
}

transition();

//This has been completed. All songs have been put into the database.
/*
TO DO:
1. Figure out the connection to the database that I need to fix. (Fucking GoDaddy.)
2. IF I can get it fixed, use this script to upload all songs to the database.
3. Start writing the application.
*/