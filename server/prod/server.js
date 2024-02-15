const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event, context) => {
    try {
        // Extract the HTTP method and path from the event object
        const { httpMethod, path } = event;
        console.log('Req : ', httpMethod);

        // Handle CORS preflight request
        if (httpMethod === 'OPTIONS') {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': 'https://codingdev.netlify.app',
                    'Access-Control-Allow-Methods': 'GET, POST',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: ''
            };
        }

        // Define a response object with CORS headers
        let response = {
            headers: {
                'Access-Control-Allow-Origin': 'https://codingdev.netlify.app',
                'Access-Control-Allow-Methods': 'GET, POST',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        };

        // Handle GET requests to the /get endpoint
        if (httpMethod === 'GET' && path === '/get') {
            response.statusCode = 200;
            response.body = 'Hello World!';
        }

        // Handle GET requests to the /run endpoint
        else if (httpMethod === 'GET' && path === '/run') {
            // Execute the shell command
            await new Promise((resolve, reject) => {
                exec('npx playwright test /tmp/generated-test-case.spec.ts', (error, stdout, stderr) => {
                    if (error) {
                        console.error('Error running test:', error);
                        response.statusCode = 500;
                        response.body = 'Test execution failed.';
                        reject(error);
                    } else {
                        console.log('Execution of shell command is complete!');
                        response.statusCode = 200;
                        response.body = 'Execution of shell command is complete!';
                        resolve();
                    }
                });
            });
        }

        // Handle POST requests to the /runtest endpoint
        else if (httpMethod === 'POST' && path === '/runtest') {
            const { testCase } = JSON.parse(event.body);

            // Check if testCase is valid
            if (!testCase || typeof testCase !== 'string') {
                console.error('Invalid test case data:', testCase);
                response.statusCode = 400;
                response.body = 'Invalid test case data.';
            } else {
                // Save the test case data to a file in the /tmp directory
                const filePath = path.join('/tmp', 'generated-test-case.spec.ts');
                await fs.writeFile(filePath, testCase, 'utf8');
                console.log('Test case written to file successfully.');

                // Execute the test case
                await new Promise((resolve, reject) => {
                    exec(`npx playwright test ${filePath}`, (error, stdout, stderr) => {
                        if (error) {
                            console.error('Error running test:', error);
                            response.statusCode = 500;
                            response.body = 'Test execution failed.';
                            reject(error);
                        } else {
                            console.log('Test execution completed successfully.');
                            response.statusCode = 200;
                            response.body = stdout;
                            resolve();
                        }
                    });
                });
            }
        }

        // Return the response
        return response;
    } catch (error) {
        console.error('Error:', error);
        return { statusCode: 500, body: 'Internal Server Error' };
    }
};