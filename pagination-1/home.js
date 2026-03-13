const express = require('express');
const app = express();
const mysql = require('mysql2/promise');

const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

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
            password: 'Root@12345',
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

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});