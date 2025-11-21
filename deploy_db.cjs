
const https = require('https');
const fs = require('fs');
const path = require('path');

const PROJECT_REF = 'tfjcyzsryigjzrbazgxu';
const TOKEN = 'sbp_e40171bea7467b0a0341ec0bcb9ac180e5772433';

// Read the SQL file
const sqlPath = path.join(__dirname, 'update_schema.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

function runQuery(query) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.supabase.com',
            path: `/v1/projects/${PROJECT_REF}/database/query`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(data);
                } else {
                    reject(new Error(`Status: ${res.statusCode}, Body: ${data}`));
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(JSON.stringify({ query }));
        req.end();
    });
}

async function main() {
    try {
        console.log('Checking existing tables...');
        try {
            const tables = await runQuery("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
            console.log('Current tables:', tables);
        } catch (e) {
            console.log('Could not list tables (might be first run or permission issue):', e.message);
        }

        console.log('Applying schema updates...');
        const result = await runQuery(sql);
        console.log('Schema applied successfully:', result);

        console.log('Verifying tables...');
        const tablesAfter = await runQuery("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log('Tables after update:', tablesAfter);

    } catch (error) {
        console.error('Error deploying schema:', error.message);
    }
}

main();
