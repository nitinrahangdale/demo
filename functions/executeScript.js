const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const shell = require('shelljs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Endpoint to execute the test case
app.post('/runtest', async (req, res) => {
    try {
        // Get the test case data from the request body
        const { testCase } = req.body;

        // Check if testCase is valid
        if (!testCase || typeof testCase !== 'string') {
            console.error('Invalid test case data:', testCase);
            return res.status(400).send('Invalid test case data.');
        }

        // Save the test case data to a file
        const filePath = path.join('/tmp', 'generated-test-case.spec.ts');
        await fs.writeFile(filePath, testCase, 'utf8');

        console.log('Test case written to file successfully.');

        // Execute the test case using shell command
        shell.cd('/tmp'); // Change directory to /tmp
        const result = shell.exec(`npx playwright test ${filePath}`);

        if (result.code === 0) {
            console.log('Test execution completed successfully.');
            res.status(200).send(result.stdout);
        } else {
            console.error('Error running test:', result.stderr);
            res.status(500).send('Test execution failed.');
        }

    } catch (error) {
        console.error('Error running test:', error);
        res.status(500).send('Test execution failed.');
    }
});

module.exports.handler = app;