"use strict";

const jsonschema = require("jsonschema");
const express = require("express");

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/partialUpdate");
//const { ensureAdmin } = require("../middleware/auth");

const newSongSchema = require("../schemas/newSongSchema.json");
const updateSongSchema = require("../schemas/updateSongSchema.json");

const router = new express.Router();

router.get("/", async(req,res,next) => {
    try{
        const query = `
            SELECT title, artist, release_year AS releaseYear, genre, confirmed_genre AS confirmedGenre, link, confirmed_link AS confirmedLink, lyrics
            FROM songs
            ORDER BY title ASC
        `;
        await db.query(query, (err, results) => {
            if(err){
                const error = {
                    "error": "Request cannot be completed, please try again."
                }
                res.status(400).send(Object(JSON.parse(JSON.stringify(error))));
            }
            let rows = [];
            if(results){
                if(results.length > 0){
                    for(let row of results){
                        rows.push(Object(JSON.parse(JSON.stringify(row))));
                    }
                    res.send(rows);
                } else {
                    console.log("No Data")
                }
            }
        });
    } catch (e) {
        return next(e)
    }
});
router.get("/count", async(req,res,next) =>{
    try{
        const query = `
            SELECT COUNT(*) AS songs FROM songs
        `;
        await db.query(query, (err, results) => {
            if(err){
                const error = {
                    "error": "Request cannot be completed, please try again."
                }
                res.status(400).send(Object(JSON.parse(JSON.stringify(error))));
            }
            if(results){
                if(results.length > 0){
                    const sC = results[0].songs;
                    const songsCount = { "count": sC }
                    res.status(201).send(Object(JSON.parse(JSON.stringify(songsCount))));
                } else {
                    console.log("No Data")
                }
            }
        })
    } catch(e) {
        return next(e);
    }
});
router.get("/:id", async(req,res,next) =>{
    try{
        const getSongById = async (id) => {
            const query = `
                SELECT title, artist, release_year AS releaseYear, genre, confirmed_genre AS confirmedGenre, link, confirmed_link AS confirmedLink, lyrics
                FROM songs
                WHERE id = ?
            `;
            await db.query(query, [id], (err, results) =>{
                if(results[0] === undefined | null){
                    const error = {
                        "error":`There is no song with ID ${id}`
                    }
                    res.status(400).send(Object(JSON.parse(JSON.stringify(error))));
                } else {
                    res.send(Object(JSON.parse(JSON.stringify(results[0]))));
                }
            });
        }
        getSongById(req.params.id);
    } catch (e) {
        return next(e)
    }
});

router.post("/", async(req,res,next) => {
    try{
        const validator = jsonschema.validate(req.body, newSongSchema);

        if(!validator.valid) {
            const errs = validator.errors.map( e => e.stack);
            const errors = {"errors": errs}
            res.status(400).send(Object(JSON.parse(JSON.stringify(errors))));
        }

        const createSong = async({title, artist, release, genre, confirmedGenre, link, confirmedLink, lyrics}) => {
            await db.query(`
                SELECT *
                FROM songs
                WHERE title = ?
            `, [title], async(err, results) => {
                if(results.length > 0) {
                    const error = {
                        "error":`Duplicate song: ${title} ID: ${results.id}`
                    }
                    res.status(409).send(Object(JSON.parse(JSON.stringify(error))));
                } else {
                    const query = `
                        INSERT INTO songs(title, artist, release_year, genre, confirmed_genre, link, confirmed_link, lyrics)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    `;
                    const values = [title, artist, release, genre, confirmedGenre, link, confirmedLink, lyrics];
                    await db.query(query, values, (err, results) => {
                        if(err){
                            const error = {
                                "error":err
                            }
                            res.status(400).send(Object(JSON.parse(JSON.stringify(error))));
                        }
                        const result = {
                            "affectedRows": results.affectedRows,
                            "message": `Successfully added ${title}`
                        }
                        res.status(201).send(result);
                    });
                }
            });
        }
        createSong(req.body);
    } catch(e){
        return next(e);
    }
});

router.patch("/:id", async(req,res,next) => {
    try{
        const validator = jsonschema.validate(req.body, updateSongSchema);

        if(!validator.valid) {
            const errs = validator.errors.map( e => e.stack );
            const errors = {"errors":errs}
            res.status(400).send(Object(JSON.parse(JSON.stringify(errors))));
        }
        const updateSong = async (id, data) => {
            const {setCols, values} = sqlForPartialUpdate(data, {});
            const query = `
                UPDATE songs
                SET ${setCols}
                WHERE id = ?
            `;
            await db.query(query, [...values, id], (err, results) => {
                if(err){
                    const error = {
                        "error": `Song with ID ${id} does not exist`
                    }
                    res.status(400).send(Object(JSON.parse(JSON.stringify(error))));
                }
                const result = {
                    "affectedRows": results.affectedRows,
                    "message":`Successfully updated song ID ${id}`
                }
                res.status(204).send(Object(JSON.parse(JSON.stringify(result))));
            });
        }
        updateSong(req.params.id, req.body)
    } catch (e) {
        return next(e)
    }
});

router.delete("/:id", async(req,res,next) => {
    try{
        await db.query(`
            DELETE
            FROM songs
            WHERE id = ?
        `, [req.params.id], (err, results) => {
            if(results.affectedRows > 0){
                return res.json({ deleted: `Song ID ${req.params.id}`});
            } else {
                return res.json({ "error": `Song with ID ${req.params.id} does not exist.`});
            }
        });
    } catch (e) {
        return next(e)
    }
});

module.exports = router;