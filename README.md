# MyFirstAngularApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.18.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## GitHub Actions + AI + SonarQube

This project now includes a GitHub Actions workflow for:
- building the Angular app
- running a SonarQube analysis
- triggering an AI review step after pushes

### Required GitHub secrets
Create these secrets in your GitHub repository:
- SONAR_TOKEN
- SONAR_HOST_URL
- OPENAI_API_KEY (optional, if you connect the AI step to OpenAI)

### Local SonarQube check
If SonarQube is not installed locally, install it first or use a remote SonarQube server.

Run:
```bash
npx sonar-scanner -Dsonar.host.url=http://localhost:9000 -Dsonar.login=your-token
```

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
