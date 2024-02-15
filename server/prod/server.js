const fs = require('fs').promises;
const path = require('path');
const shell = require('shelljs');

exports.handler = async (event, context) => {
    try {
        // Extract the HTTP method and path from the event object
        const { httpMethod, path } = event;

        // Define response headers for CORS
        const headers = {
            'Access-Control-Allow-Origin': 'https://codingdev.netlify.app',
            'Access-Control-Allow-Methods': 'GET, POST',
            'Access-Control-Allow-Headers': 'Content-Type'
        };

        // Handle CORS preflight request
        if (httpMethod === 'OPTIONS') {
            return {
                statusCode: 200,
                headers,
                body: ''
            };
        }

        // Define response object
        let response;

        // Handle GET requests to the /get endpoint
        if (httpMethod === 'GET' && path === '/get') {
            response = {
                statusCode: 200,
                headers,
                body: 'Hello World!'
            };
        }

        // Handle GET requests to the /run endpoint
        else if (httpMethod === 'GET' && path === '/run') {
            // Execute the shell command
            const result = shell.exec('npx playwright test ../tests/generated-test-case.js');
            if (result.code !== 0) {
                console.error('Error running test:', result.stderr);
                response = {
                    statusCode: 500,
                    headers,
                    body: 'Test execution failed.'
                };
            } else {
                console.log('Execution of shell command is complete!');
                response = {
                    statusCode: 200,
                    headers,
                    body: 'Execution of shell command is complete!'
                };
            }
        }

        // Handle POST requests to the /runtest endpoint
        else if (httpMethod === 'POST' && path === '/runtest') {
            const { testCase } = JSON.parse(event.body);

            // Check if testCase is valid
            if (!testCase || typeof testCase !== 'string') {
                console.error('Invalid test case data:', testCase);
                response = {
                    statusCode: 400,
                    headers,
                    body: 'Invalid test case data.'
                };
            } else {
                // Save the test case data to a file
                const filePath = path.join('/tmp', 'generated-test-case.spec.ts');
                await fs.writeFile(filePath, testCase, 'utf8');
                console.log('Test case written to file successfully.');

                // Execute the test case
                const result = shell.exec(`npx playwright test ${filePath}`);
                if (result.code !== 0) {
                    console.error('Error running test:', result.stderr);
                    response = {
                        statusCode: 500,
                        headers,
                        body: 'Test execution failed.'
                    };
                } else {
                    console.log('Test execution completed successfully.');
                    response = {
                        statusCode: 200,
                        headers,
                        body: 'Test execution completed successfully.'
                    };
                }
            }
        }

        // Return the response
        return response = {
            statusCode: 404,
            headers,
            body: 'Not Found'
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: 'Internal Server Error'
        };
    }
};