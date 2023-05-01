## Dynatrace Datasource - graph metrics from Dynatrace

Grafana Plugin to Graph timeseries from Dynatraces API

![]![image](https://user-images.githubusercontent.com/34588898/235481721-67574a36-e63c-4a4d-9686-0e62002261c3.png))

More information on the [Dynatrace API](https://www.dynatrace.com/support/help/dynatrace-api/timeseries/how-do-i-fetch-the-metrics-of-monitored-entities/)


## Limitations and issues

- Problems and events API are not implemented, only metrics


## Installation

git clone /tmp/
cd /tmp/grafana-dynatrace-datasource
yarn install
npm run build
rm -Rf /usr/share/grafana/data/plugins/grafana-dynatrace-datasource/ && rm -Rf /var/lib/grafana/plugins/grafana-dynatrace-datasource/ && mkdir /usr/share/grafana/data/plugins/grafana-dynatrace-datasource && mkdir /var/lib/grafana/plugins/grafana-dynatrace-datasource/ && cp -Rf dist/* /usr/share/grafana/data/plugins/grafana-dynatrace-datasource && cp -Rf dist/*  /var/lib/grafana/plugins/grafana-dynatrace-datasource/


![image](https://user-images.githubusercontent.com/34588898/235481847-dc647fc5-5384-443c-b053-80b0bbf1e300.png)



