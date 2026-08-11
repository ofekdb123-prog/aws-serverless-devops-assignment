# AWS Serverless Infrastructure with IaC and GitHub Actions

## Project Overview
This project provisions an automated, serverless architecture on AWS using the AWS Cloud Development Kit (CDK) with TypeScript. 

The system automatically scans an Amazon S3 bucket for existing objects upon execution, sends detailed notifications via Amazon SNS to subscribed email addresses, and uploads sample files during the infrastructure deployment process.

---

## Tools & Frameworks Used
* **Infrastructure as Code (IaC):** AWS CDK (TypeScript)
* **Compute:** AWS Lambda (Python 3.12)
* **Storage & Messaging:** Amazon S3, Amazon SNS
* **CI/CD:** GitHub Actions
* **Testing:** Jest, AWS CDK Assertions

---

## Architecture Components
* **Amazon S3 Bucket:** Stores uploaded application files and assets. Local files from the `sample_files/` directory are automatically uploaded during deployment.
* **AWS Lambda Function (Python 3.12):** Scans the S3 bucket and publishes execution status to the SNS topic. Includes robust error handling (`try-except`) for system resilience.
* **Amazon SNS Topic:** Manages email notifications for system triggers and executions.
* **AWS IAM Role:** Implements least-privilege access permissions for S3 read access, SNS publishing, and CloudWatch logging capabilities.
* **CI/CD Pipeline:** Automated deployment and testing via GitHub Actions workflow (`deploy.yml`).

---

## Project Structure
```text
.
├── bin/                         # CDK application entry point
├── lib/                         # CDK infrastructure code (Stack definition)
├── lambda/                      # Lambda function code (Python)
├── test/                        # CDK unit tests (Jest & CDK Assertions)
├── sample_files/                # Local files uploaded to S3 during deployment
└── .github/workflows/deploy.yml # GitHub Actions CI/CD pipeline
```

---

## Testing Framework

### Automated Unit Tests (Jest & CDK Assertions)
The project includes fine-grained infrastructure unit tests located in `test/aws-serverless-devops-assignment.test.ts`.

These tests evaluate the generated CloudFormation template to verify:
* Exact resource counts (1 S3 Bucket, 1 SNS Topic).
* Lambda function configuration and runtime (`python3.12`).

To run unit tests locally:
```bash
npm test
```

Unit tests run automatically as Step 4 in the GitHub Actions CI/CD pipeline prior to synthesizing and deploying the stack.

---

## Setup and Deployment Steps

### CI/CD Deployment (GitHub Actions)
This project uses GitHub Actions for continuous integration and continuous deployment (CI/CD). The workflow triggers automatically on pushes to `main` or manually via `workflow_dispatch`.

1. Navigate to the **Actions** tab in this GitHub repository.
2. Select the **Deploy CDK Stack to AWS** workflow from the left sidebar.
3. Click the **Run workflow** button to trigger the deployment manually.
4. The workflow automatically installs dependencies, executes Jest unit tests, synthesizes the CloudFormation template, and deploys the stack to AWS.

### Prerequisites (For Local Deployment/Testing)
If you wish to deploy manually from your local machine, ensure you have the following installed:
* Node.js & npm
* Python 3.12
* AWS CLI (configured with your credentials)
* AWS CDK CLI (`npm install -g aws-cdk`)

To deploy locally:
```bash
npm install
cdk bootstrap
cdk synth
cdk deploy
```

---

## ⚠️ Important: SNS Email Confirmation
**Please note:** After the initial deployment, AWS SNS will send a subscription confirmation email to the configured email address. **The recipient must open this email and click "Confirm subscription"** before the Lambda function can successfully send execution notifications.

---

## Manual Lambda Test & Execution Handling
To test the Lambda function manually and verify that it lists the S3 objects and sends an email via SNS, trigger it using the AWS CLI:

Find the deployed function name in the AWS Lambda console, or run:
```bash
aws cloudformation describe-stack-resources --stack-name AwsServerlessDevopsAssignmentStack --query "StackResources[?ResourceType=='AWS::Lambda::Function' && starts_with(LogicalResourceId,'ListS3Lambda')].PhysicalResourceId" --output text
```

Then trigger the Lambda function:
```bash
aws lambda invoke \
    --function-name <Your-Lambda-Function-Name> \
    --cli-binary-format raw-in-base64-out \
    --payload '{}' \
    response.json
```

### Expected Behavior & Error Handling
* **Success (`HTTP 200`):** The function successfully lists S3 objects, publishes a summary message to SNS, and returns a JSON response with status code `200`.
* **Failure Handling (`HTTP 500`):** The function is wrapped in a `try-except` block. If an error occurs (e.g., missing permissions, S3 access failure), it catches the exception, logs details to AWS CloudWatch Logs, and returns an `HTTP 500` response containing the error message.