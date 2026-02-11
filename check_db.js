const pool = require('./config/db');

async function checkTables() {
    const tables = ['public_post_comments', 'private_post_comments', 'learning_content_comments', 'book_comments'];
    for (const table of tables) {
        try {
            console.log(`--- Table: ${table} ---`);
            const [columns] = await pool.query(`DESCRIBE ${table}`);
            console.table(columns);
        } catch (error) {
            console.error(`Error describing ${table}: ${error.message}`);
        }
    }
    process.exit();
}

checkTables();
