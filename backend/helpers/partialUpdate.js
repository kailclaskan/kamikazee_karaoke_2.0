const sqlForPartialUpdate = (data, jsToSql) => {
    const keys = Object.keys(data);
    if(keys.length === 0) throw new BadRequestError("No Data");

    const cols = keys.map((colName, idx) =>
        //For Postrgresql it should be $${idx+1}
        `${jsToSql[colName] || colName}=?`,
    );
    return{
        setCols: cols.join(", "),
        values: Object.values(data),
    };
}

module.exports = { sqlForPartialUpdate };