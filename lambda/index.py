import os
import json
import boto3

s3_client = boto3.client('s3')
sns_client = boto3.client('sns')

def handler(event, context):
    try:
        bucket_name = os.environ['BUCKET_NAME']
        topic_arn = os.environ['TOPIC_ARN']

        # List objects in S3
        response = s3_client.list_objects_v2(Bucket=bucket_name)
        objects = response.get('Contents', [])
        object_keys = [obj['Key'] for obj in objects]

        # Prepare notification
        message = f"Lambda execution completed.\nBucket: {bucket_name}\nObjects ({len(object_keys)}):\n" + "\n".join(object_keys)

        # Publish to SNS
        sns_client.publish(
            TopicArn=topic_arn,
            Subject="AWS Lambda S3 Execution Notification",
            Message=message
        )

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Success', 'objects': object_keys})
        }
    
    except Exception as e:
        print(f"Error executing Lambda: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Internal Server Error', 'error': str(e)})
        }