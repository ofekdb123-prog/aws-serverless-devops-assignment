import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { AwsServerlessDevopsAssignmentStack } from '../lib/aws-serverless-devops-assignment-stack';

test('Stack creates required AWS resources', () => {
  const app = new cdk.App();
  const stack = new AwsServerlessDevopsAssignmentStack(app, 'MyTestStack');
  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::S3::Bucket', 1);
  template.resourceCountIs('AWS::SNS::Topic', 1);
  template.hasResourceProperties('AWS::Lambda::Function', { Runtime: 'python3.12' });
});