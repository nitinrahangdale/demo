const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event, context) => {
    try {
        // Define a response object
        let response;

        // Extract the HTTP method and path from the event object
        const { httpMethod, path } = event;

        // Handle CORS preflight request
        if (httpMethod === 'OPTIONS') {
            response = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': 'https://codingdev.netlify.app',
                    'Access-Control-Allow-Methods': 'GET, POST',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: ''
            };
            return response;
        }

        // Handle GET requests to the /get endpoint
        if (httpMethod === 'GET' && path === '/get') {
            response = {
                statusCode: 200,
                body: 'Hello World!'
            };
        }

        // Handle GET requests to the /run endpoint
        else if (httpMethod === 'GET' && path === '/run') {
            // Execute the shell command
            exec('npx playwright test /tmp/generated-test-case.spec.ts', (error, stdout, stderr) => {
                if (error) {
                    console.error('Error running test:', error);
                    response = { statusCode: 500, body: 'Test execution failed.' };
                    return;
                }
                console.log('Execution of shell command is complete!');
                response = { statusCode: 200, body: 'Execution of shell command is complete!' };
            });
        }

        // Handle POST requests to the /runtest endpoint
        else if (httpMethod === 'POST' && path === '/runtest') {
            const { testCase } = JSON.parse(event.body);

            // Check if testCase is valid
            if (!testCase || typeof testCase !== 'string') {
                console.error('Invalid test case data:', testCase);
                return { statusCode: 400, body: 'Invalid test case data.' };
            }

            // Save the test case data to a file in the /tmp directory
            await fs.writeFile(path.resolve('/tmp/generated-test-case.spec.ts'), testCase, 'utf8');

            console.log('Test case written to file successfully.');

            // Execute the test case
            exec('npx playwright test /tmp/generated-test-case.spec.ts', (error, stdout, stderr) => {
                if (error) {
                    console.error('Error running test:', error);
                    response = { statusCode: 500, body: 'Test execution failed.' };
                    return;
                }
                console.log('Test execution completed successfully.');
                response = { statusCode: 200, body: stdout };
            });
        }

        // Return a 404 for unrecognized routes
        else {
            response = { statusCode: 404, body: 'Not Found' };
        }

        // Add CORS headers to the response
        response.headers = {
            'Access-Control-Allow-Origin': 'https://codingdev.netlify.app',
            'Access-Control-Allow-Methods': 'GET, POST',
            'Access-Control-Allow-Headers': 'Content-Type'
        };

        return response;
    } catch (error) {
        console.error('Error:', error);
        return { statusCode: 500, body: 'Internal Server Error' };
    }
};
