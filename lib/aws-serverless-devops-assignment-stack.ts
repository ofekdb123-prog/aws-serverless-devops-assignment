import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as path from 'path';

export class AwsServerlessDevopsAssignmentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. Create S3 Bucket
    const bucket = new s3.Bucket(this, 'MyAssignmentBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // 2. Upload local sample files to S3 on deployment
    new s3deploy.BucketDeployment(this, 'DeploySampleFiles', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '../sample_files'))],
      destinationBucket: bucket,
    });

    // 3. Create SNS Topic & Email Subscription
    const topic = new sns.Topic(this, 'NotificationTopic', {
      displayName: 'S3 Lambda Notification Topic',
    });

    topic.addSubscription(new subscriptions.EmailSubscription('Ofekdav@post.bgu.ac.il'));

    // 4. Create Lambda Function
    const listS3Lambda = new lambda.Function(this, 'ListS3Lambda', {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      environment: {
        BUCKET_NAME: bucket.bucketName,
        TOPIC_ARN: topic.topicArn,
      },
    });

    // 5. Least Privilege Permissions (IAM)
    bucket.grantRead(listS3Lambda);
    topic.grantPublish(listS3Lambda);
  }
}