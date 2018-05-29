# ALIEM Cards API

Node app to build an API. All of the JSON files that make up the API are static and served via GitHub. The JSON files are built by the scripts in the `build` directory. JSON files acting as api endpoints are found in the `dist` directory.

The API also uses an AWS Lambda to handle search. This script is located in the `lambda` directory. AWS provisioning is handled using the [Serverless framework](https://serverless.com/).