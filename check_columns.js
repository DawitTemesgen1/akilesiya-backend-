const pool = require('./config/db');

async function checkSchema() {
    try {
        const [columns] = await pool.query(`SHOW COLUMNS FROM custom_field_values`);
        console.log("COLUMNS IN custom_field_values:");
        console.table(columns);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkSchema();
