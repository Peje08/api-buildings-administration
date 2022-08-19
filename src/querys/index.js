const query = () => (`
    SELECT colum1, column2
    FROM table
    WHERE column = :var'
`);


module.exports = { query }