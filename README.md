## Dynatrace Datasource - graph metrics from Dynatrace

Grafana Plugin to Graph timeseries from Dynatraces API

![](https://raw.githubusercontent.com/piotr1212/grafana-dynatrace-datasource/master/docs/example_panel.png)

More information on the [Dynatrace API](https://www.dynatrace.com/support/help/dynatrace-api/timeseries/how-do-i-fetch-the-metrics-of-monitored-entities/)


## Limitations and issues

- Problems and events API are not implemented, only Timeseries


## Installation

cd /tmp
git clone https://github.com/apoc1238/GrafanaDatasource_DynatraceAPIv2Metric.git
yarn install
npm run build


![image](![image](https://user-images.githubusercontent.com/34588898/235482750-b68a911c-5c73-49f4-8529-6ab888a80256.png))



Build and run:

```
cd grafana-dynatrace-datasource
docker build -t grafana:latest-with-plugins .
docker run -d -p 3000:3000 grafana:latest-with-plugins
```

### Changelog

1.0.1
- Initial release
- Update Dockerfile to build with Grafana v7.0+
# GrafanaDatasource_DynatraceAPIv2Metric
# GrafanaDatasource_DynatraceAPIv2Metric
# GrafanaDatasource_DynatraceAPIv2Metric
