const pool = require('./config/db');

const migrations = [
    "ALTER TABLE public_post_comments ADD COLUMN IF NOT EXISTS parent_id INT NULL, ADD CONSTRAINT fk_public_comment_parent FOREIGN KEY (parent_id) REFERENCES public_post_comments(id) ON DELETE CASCADE;",
    "ALTER TABLE private_post_comments ADD COLUMN IF NOT EXISTS parent_id INT NULL, ADD CONSTRAINT fk_private_comment_parent FOREIGN KEY (parent_id) REFERENCES private_post_comments(id) ON DELETE CASCADE;",
    "ALTER TABLE learning_content_comments ADD COLUMN IF NOT EXISTS parent_id INT NULL, ADD CONSTRAINT fk_learning_comment_parent FOREIGN KEY (parent_id) REFERENCES learning_content_comments(id) ON DELETE CASCADE;",
    "ALTER TABLE book_comments ADD COLUMN IF NOT EXISTS parent_id INT NULL, ADD CONSTRAINT fk_book_comment_parent FOREIGN KEY (parent_id) REFERENCES book_comments(id) ON DELETE CASCADE;"
];

async function runMigrations() {
    for (const sql of migrations) {
        try {
            console.log(`Running: ${sql}`);
            await pool.query(sql);
            console.log("Success!");
        } catch (error) {
            if (error.code === 'ER_DUP_COLUMN_NAME') {
                console.log("Column already exists, skipping...");
            } else if (error.code === 'ER_FK_DUP_NAME') {
                console.log("Constraint already exists, skipping...");
            } else {
                console.error(`Error: ${error.message}`);
            }
        }
    }
    process.exit();
}

runMigrations();
