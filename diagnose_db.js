const pool = require('./config/db');

async function diagnose() {
    try {
        const [tables] = await pool.query("SHOW TABLES");
        console.log("Tables in database:", tables.map(t => Object.values(t)[0]));

        const commentTables = ['public_post_comments', 'private_post_comments', 'learning_content_comments', 'book_comments'];
        for (const table of commentTables) {
            console.log(`\n--- Checking ${table} ---`);
            try {
                const [columns] = await pool.query(`SHOW COLUMNS FROM ${table}`);
                console.table(columns.map(c => ({ Field: c.Field, Type: c.Type, Null: c.Null })));
            } catch (e) {
                console.error(`Error checking ${table}: ${e.message}`);
            }
        }
    } catch (error) {
        console.error("FATAL Database Connection Error:", error.message);
    }
    process.exit();
}

diagnose();
