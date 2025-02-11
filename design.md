## Architecture 

### Used npm packages
1. `telegraf` Main package for interacting with telegram API.
2. `typegram` Types for the whole Telegram API.
3. `dotenv`   Package for parsing environment variables.
4. `nodemon`  Automatically restart the application when file chanages are detected. 
5. `eslint`   Structuring the code.
6. `prettier` Formatting the code.
7. `husky`    Creating pre-commit hooks. 
8. `pino`     Logging.

### Bot commands 
1. `/about` - Gives a short introduction about myself.
1. `/start` - Displays a list of available commands.
2. `/help`  - Currently does exactly the same as start.
3. `/links` - Displays social media links.

### Attach debugger to Node.js TypeScript app
`node --inspect-brk -r ts-node/register src/index.ts`

### Deploying to google cloud run
Building docker image: `docker build -t europe-north1-docker.pkg.dev/deployment-testing-project-234/deploy-testing-repository/chatbot-app:0.1.0 .`

Push docker image to the Artifact Registry: `docker push europe-north1-docker.pkg.dev/deployment-testing-project-234/deploy-testing-repository/chatbot-app:0.1.0` 