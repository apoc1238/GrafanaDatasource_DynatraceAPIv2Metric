## Dynatrace Datasource - graph metrics from Dynatrace


## Limitations and issues

- Problems and events API are not implemented, only metrics


## Installation

cd /tmp
git clone https://github.com/apoc1238/GrafanaDatasource_DynatraceAPIv2Metric.git
yarn install
npm run build




Build and run:

```
cd grafana-dynatrace-datasource
docker build -t grafana:latest-with-plugins .
docker run -d -p 3000:3000 grafana:latest-with-plugins
```


