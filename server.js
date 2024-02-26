const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const shell = require('shelljs');
const fs = require('fs').promises;
const { test, expect, chromium } = require('@playwright/test');
const PORT =  process.env.PORT || 3000;

const app = express();
const cors = require('cors');
// Use CORS middleware
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

app.use(bodyParser.json());

app.get('/get', (req, res) => {
    res.send('Hello World!');
});

app.get('/run', (req, res) => {
    const file = path.resolve('../tests/example.spec.ts');
    shell.cd('../tests');
    shell.exec('npx playwright test generated-test-case.js');
    res.send('Execution of shell command is complete!');
});

// Endpoint to receive and execute the test case
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
        await fs.writeFile('generated-test-case.spec.ts', testCase, 'utf8');

        console.log('Test case written to file successfully.');
        // Execute the test case
        const result = shell.exec('npx playwright test');

        // Capture the output of the test case execution
        const output = result.stdout;
        console.log(output);

        if (result.code === 0) {
            console.log('Test execution completed successfully.');
            res.status(200).send(JSON.stringify(output)); // Update this line
        } else {
            console.error('Error running test:', result.stderr);
            res.status(500).send('Test execution failed.');
        }

    } catch (error) {
        console.error('Error running test:', error);
        res.status(500).send('Test execution failed.');
    }
});

app.listen(PORT, function (err) {
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", PORT);
})