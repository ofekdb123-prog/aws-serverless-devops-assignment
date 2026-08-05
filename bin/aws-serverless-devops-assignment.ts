#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsServerlessDevopsAssignmentStack } from '../lib/aws-serverless-devops-assignment-stack';

const app = new cdk.App();
new AwsServerlessDevopsAssignmentStack(app, 'AwsServerlessDevopsAssignmentStack', {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1' 
  },
});