// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import * as cdk from "@aws-cdk/core";
import { CfnParameter, Duration } from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigw from "@aws-cdk/aws-apigateway";
import * as acm from "@aws-cdk/aws-certificatemanager";
import * as route53 from "@aws-cdk/aws-route53";
import * as targets from "@aws-cdk/aws-route53-targets";
import * as origins from "@aws-cdk/aws-cloudfront-origins";

export class SsrStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const mySiteBucketName = new CfnParameter(this, "mySiteBucketName", {
      type: "String",
      description: "The name of S3 bucket to upload react application"
    });

    const mySiteBucket = new s3.Bucket(this, "ssr-site", {
      bucketName: mySiteBucketName.valueAsString,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "error.html",
      publicReadAccess: false,
      //only for demo not to use in production
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
    new cdk.CfnOutput(this, "Bucket", { value: mySiteBucket.bucketName });

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      "ssr-oia"
    );
    mySiteBucket.grantRead(originAccessIdentity);

    new s3deploy.BucketDeployment(this, "Client-side React app", {
      sources: [s3deploy.Source.asset("../simple-ssr/out/")],
      destinationBucket: mySiteBucket,
      cacheControl: [
        s3deploy.CacheControl.setPublic(),
        s3deploy.CacheControl.maxAge(Duration.days(1)), // Cache for 1 day
      ],
    });

    const primaryDomain = "learnbetterlife.com"

    const cert =           acm.Certificate.fromCertificateArn(
      this,
      "Certificate",
      "arn:aws:acm:us-east-1:423832951467:certificate/b8d7269e-0a99-4a29-8720-28b9125f6723"
    )

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "ssr-cdn",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: mySiteBucket,
              originAccessIdentity: originAccessIdentity
            },
            behaviors: [
              {
                isDefaultBehavior: true,
              }
            ]
          }
        ],
        viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(
          cert,
          {
            aliases: [primaryDomain],
          },
        ),
      }
    );

    // We are using a Zone that already exists so we can use a lookup on the Zone name.
    const zone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      'baseZone',
      { hostedZoneId: 'Z0970861187VGV4X6RTQJ', zoneName: 'learnbetterlife.com'}
    )
    

    // Adding out A Record code
    new route53.ARecord(this, "CDNARecord", {
      zone,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
    });

    new route53.AaaaRecord(this, "AliasRecord", {
      zone,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
    });

    new cdk.CfnOutput(this, "CF URL", {
      value: `https://${distribution.distributionDomainName}`
    });
  }
}
