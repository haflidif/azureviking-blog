---
applyTo: '.github/workflows/*.yml,.github/workflows/*.yaml'
description: 'Comprehensive guide for building robust, secure, and efficient CI/CD pipelines using GitHub Actions.'
---

# GitHub Actions CI/CD Best Practices

## Core Concepts and Structure

### Workflow Structure

- Use consistent, descriptive names for workflow files (e.g., `build-and-test.yml`, `deploy-prod.yml`).
- Understand the full range of events: `push`, `pull_request`, `workflow_dispatch`, `schedule`, `repository_dispatch`, `workflow_call`.
- Use `concurrency` to prevent simultaneous runs for specific branches or groups.
- Define `permissions` at the workflow level for a secure default, overriding at the job level if needed.
- For complex repositories, consider using reusable workflows (`workflow_call`) to reduce duplication.

### Jobs

- Jobs should represent distinct, independent phases (e.g., build, test, deploy, lint, security scan).
- Choose appropriate runners (`ubuntu-latest`, `windows-latest`, `macos-latest`, or `self-hosted`).
- Use `needs` to define dependencies between jobs.
- Use `outputs` to pass data between jobs.
- Use `if` conditions for conditional execution based on branch names, event types, or previous job status.

### Steps

- Use descriptive `name` for each step.
- Use `id` for steps whose outputs are referenced later.
- Use official GitHub Actions (`actions/checkout@v4`, `actions/setup-node@v4`).
- Pin actions to a specific version or commit SHA for security and reproducibility.
- Use `continue-on-error: true` for non-critical steps.
- Break down complex `run` scripts into multiple steps.

## Security

### Secret Management

- Store sensitive values in GitHub Secrets (repository or organization level).
- Never hardcode secrets in workflow files.
- Prefer environment-level secrets for deployment targets.
- Rotate secrets regularly.
- Use `GITHUB_TOKEN` with minimal permissions via `permissions` block.

### Token Permissions

- Apply least privilege: request only needed scopes.
- Set `permissions` at workflow level with restrictive defaults.
- Override at job level only when needed.

### Supply Chain Security

- Pin actions to full commit SHAs instead of tags when possible.
- Use `actions/dependency-review-action` for PR dependency audits.
- Scan container images for vulnerabilities.

## Performance

### Caching

- Use `actions/cache` for dependencies and build artifacts.
- Use hashFiles() for cache keys to ensure freshness.
- Implement restore-keys for fallback cache hits.
- Cache package manager directories (e.g., `~/.pnpm-store`, `node_modules`).

### Matrix Strategies

- Use `strategy.matrix` to run tests across multiple versions, platforms, or configurations in parallel.
- Use `fail-fast: false` when you want all matrix jobs to complete.
- Use `exclude` and `include` to fine-tune matrix combinations.

### Artifacts

- Use `actions/upload-artifact` and `actions/download-artifact` for passing files between jobs.
- Set appropriate retention periods for artifacts.
- Clean up large artifacts after use.

## Testing

### Test Execution

- Run tests in CI with consistent environments.
- Use Docker `services` for test dependencies (databases, caches).
- Generate and upload coverage reports.
- Implement test splitting for large test suites.

### E2E Testing

- Use stable, unique selectors (`data-testid` attributes).
- Capture screenshots and video on failure.
- Use explicit waits instead of arbitrary `sleep` commands.

## Deployment

### Strategies

- Implement environment-based deployments (dev, staging, production).
- Use GitHub Environments with protection rules and required reviewers.
- Implement health checks after deployment.
- Have a rollback strategy ready.

### Environment Management

- Use environment-specific secrets and variables.
- Implement approval workflows for production deployments.
- Use deployment status checks and notifications.

## Troubleshooting

### Debugging

- Use `ACTIONS_STEP_DEBUG` secret for verbose logging.
- Review workflow run summaries for timing and bottleneck identification.
- Use `actions/upload-artifact` to capture debug logs and screenshots.

### Common Issues

- **Slow workflows**: Profile execution times, optimize caching, parallelize with matrix strategies.
- **Flaky tests**: Ensure test isolation, eliminate race conditions, standardize environments.
- **Deployment failures**: Review logs, validate configuration, implement health checks, have rollback ready.
