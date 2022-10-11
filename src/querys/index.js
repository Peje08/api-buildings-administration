const query = () => (`SELECT colum1, column2
    FROM table1
    WHERE column = :var
`);

module.exports = { query }