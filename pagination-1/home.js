const express = require('express');
const app = express();
const mysql = require('mysql2/promise');

const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const recordsPerPage = 10;
const baseDataQuery = 'SELECT id, fname, lname, email, phone_number, gender, dob, address, city FROM basic_info';
const countQuery = 'SELECT COUNT(*) AS totalRecords FROM basic_info';

const allowedSortColumns = ['id', 'fname', 'lname', 'email'];

app.get('/students', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Root@1234',
            database: 'students',
        });

        const [[countRow]] = await connection.query(countQuery);
        const totalRecords = Number(countRow.totalRecords) || 0;
        const totalPages = Math.max(1, Math.ceil(totalRecords / recordsPerPage));

        const page = Number.parseInt(req.query.page, 10);
        const safePage = Number.isNaN(page) ? 1 : page;
        const currentPage = Math.min(Math.max(safePage, 1), totalPages);
        const startIndex = (currentPage - 1) * recordsPerPage;

        const order = req.query.order === 'desc' ? 'DESC' : 'ASC';
        const sortBy = allowedSortColumns.includes(req.query.sortBy) ? req.query.sortBy : 'id';

        const dataQuery = `${baseDataQuery} ORDER BY ${sortBy} ${order} LIMIT ? OFFSET ?`;
        const [students] = await connection.query(dataQuery, [recordsPerPage, startIndex]);

        res.render('index', {
            students,
            totalPages,
            currentPage,
            currentOrder: order.toLowerCase(),
            currentSortBy: sortBy,
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).render('index', {
            students: [],
            totalPages: 1,
            currentPage: 1,
            currentOrder: 'asc',
            currentSortBy: 'id',
        });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});

app.get('/search', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Root@1234',
            database: 'students',
        });
        const baseQuery = 'SELECT id, fname, lname, email, phone_number, gender,dob, address, city FROM basic_info';
        const query = (req.query.query || '').trim();
        const operator = req.query.operators === 'or' ? 'or' : 'and';

        if (!query) {
            return res.render('search', {
                students: [],
                query,
                operator,
            });
        }

        const tokenToColumn = {
            '$': 'fname',
            '^': 'lname',
            '_': 'phone_number',
            '[': 'email',
            ']': 'city',
        };

        const parts = query.split(/[\s,]+/);
        const whereClauses = [];
        const queryParams = [];

        for (const rawPart of parts) {
            const part = rawPart.trim();
            if (!part) {
                continue;
            }

            const symbol = part[0];
            const term = part.slice(1).trim();
            const column = tokenToColumn[symbol];

            if (!column || !term) {
                continue;
            }

            whereClauses.push(`${column} LIKE ?`);
            queryParams.push(`%${term}%`);
        }

        let searchQuery;
        if (whereClauses.length > 0) {
            const joiner = operator === 'or' ? ' OR ' : ' AND ';
            searchQuery = `${baseQuery} WHERE ${whereClauses.join(joiner)}`;
        } else {
            searchQuery = `${baseQuery} WHERE fname LIKE ? OR lname LIKE ? OR email LIKE ? OR city LIKE ? OR phone_number LIKE ?`;
            queryParams.push(`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`);
        }

        const [students] = await connection.query(searchQuery, queryParams);

        res.render('search', {
            students,
            query,
            operator,
        });
    } catch (error) {
        console.error('Error searching students:', error);
        res.status(500).render('search', {
            students: [],
            query: req.query.query,
            operator: req.query.operators === 'or' ? 'or' : 'and',
        });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});