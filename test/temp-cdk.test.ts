import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { AwsServerlessDevopsAssignmentStack } from '../lib/aws-serverless-devops-assignment-stack';

test('Stack creates required AWS resources', () => {
  const app = new cdk.App();

  // WHEN: Synthesize the CDK stack into a CloudFormation template for testing
  const stack = new AwsServerlessDevopsAssignmentStack(app, 'MyTestStack');

  // THEN: Extract the CloudFormation template assertions helper
  const template = Template.fromStack(stack);

  // 1. Verify that exactly one S3 Bucket is created
  template.resourceCountIs('AWS::S3::Bucket', 1);

  // 2. Verify that exactly one SNS Topic is created
  template.resourceCountIs('AWS::SNS::Topic', 1);

  // 3. Verify that the Lambda Function exists and uses the Python 3.12 runtime
  template.hasResourceProperties('AWS::Lambda::Function', {
    Runtime: 'python3.12',
  });
});