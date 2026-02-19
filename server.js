const express = require('express');
const fileHandler = require('./fileHandler');
const e = require('express');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Dashboard - Display all employees
app.get('/', async (req, res) => {
    const employees = await fileHandler.read();
    const totalEmployees = employees.length;
    // Calculate unique departments (positions)
    const uniqueDepartments = new Set();
    for (const employee of employees) {
        uniqueDepartments.add(employee.position);
    }
    const totalDepartments = uniqueDepartments.size;
    let totalTax = 0;
    for (const employee of employees) {
        totalTax += employee.basicSalary * 0.12;
    }

    let totalnetSalary = 0;
    for (const employee of employees) {
        totalnetSalary += employee.basicSalary - (employee.basicSalary * 0.12);
    }


    res.render('index', { employees, totalEmployees, totalDepartments, totalTax, totalnetSalary });
});

// Show add employee form
app.get('/add', (req, res) => {
    res.render('add');
});

// Add new employee
app.post('/add', async (req, res) => {
    const employees = await fileHandler.read();

    const newEmployee = {
        id: employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1,
        name: req.body.name,
        position: req.body.position,
        basicSalary: Number(req.body.basicSalary)
    };

    employees.push(newEmployee);
    await fileHandler.write(employees);
    res.redirect('/');
});

// Show edit employee form
app.get('/edit/:id', async (req, res) => {
    const employees = await fileHandler.read();
    const employee = employees.find(e => e.id === parseInt(req.params.id));

    if (!employee) {
        return res.redirect('/');
    }

    res.render('edit', { employee });
});

// Update employee
app.post('/edit/:id', async (req, res) => {
    const employees = await fileHandler.read();
    const index = employees.findIndex(e => e.id === parseInt(req.params.id));

    if (index !== -1) {
        employees[index] = {
            id: parseInt(req.params.id),
            name: req.body.name,
            position: req.body.position,
            basicSalary: Number(req.body.basicSalary)
        };

        await fileHandler.write(employees);
    }

    res.redirect('/');
});

// Delete employee
app.get('/delete/:id', async (req, res) => {
    const employees = await fileHandler.read();
    const filtered = employees.filter(e => e.id !== parseInt(req.params.id));
    await fileHandler.write(filtered);
    res.redirect('/');
});

// Start server and log employee data
app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('\nCurrent employee data:');
    const employees = await fileHandler.read();
    console.log(JSON.stringify(employees, null, 2));
});
