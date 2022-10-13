const query = () => (`SELECT colum1, column2
    FROM table1
    WHERE column = :var
`);

const queryInsert = () => (`INSERT INTO table1 
    VALUES (:a, :b)
`);

module.exports = { query, queryInsert }
