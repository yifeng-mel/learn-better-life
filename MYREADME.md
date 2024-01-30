## Deploy
```
cd simple-ssr && npm run build && cd ../cdk && npm run build && cdk deploy SSRAppStack 
```

## Invalidate Cloud Front Cache
AWS Console -> CloudFront -> Distributions -> select the distribution -> Invalidations -> Create Invalidation