const { faker } = require('@faker-js/faker');
const mysql = require('mysql2/promise');
faker.locale = 'en_IN'

async function generateFakeData() {
    const students = [];

    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Root@1234',
        database: 'students'
    })

    for (let i = 0; i < 20000; i++) {
        const gender = faker.helpers.arrayElement(["Male", "Female"]);
        students.push({
            fname: faker.person.firstName(),
            lname: faker.person.lastName(),
            email: faker.internet.email(),
            phone_number: faker.phone.number(),
            gender: gender,
            address: faker.location.streetAddress(),
            dob: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
            city: faker.location.city()
        })
    }
    const rows = students.map((student) => [
        student.fname,
        student.lname,
        student.email,
        student.phone_number,
        student.gender,
        student.dob,
        student.address,
        student.city,
    ]);

    const insertQuery = 'INSERT INTO basic_info (fname, lname, email, phone_number, gender, dob, address, city) VALUES ?';
    await connection.query(insertQuery, [rows]);
    await connection.end();
}

generateFakeData().then(() => {
    console.log('Fake data generated and inserted into the database successfully.');
})
    .catch((error) => {
        console.error('Error generating fake data:', error);
    });