const fs = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, 'employees.json');

/**
 * Read employee data from JSON file
 * @returns {Promise<Array>} Array of employees or empty array on error
 */
async function read() {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading file:', error.message);
        // Return empty array to prevent server crashes
        return [];
    }
}

/**
 * Write employee data to JSON file
 * @param {Array} data - Array of employee objects
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
async function write(data) {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
        return true;
    } catch (error) {
        console.error('Error writing file:', error.message);
        return false;
    }
}

module.exports = { read, write };
