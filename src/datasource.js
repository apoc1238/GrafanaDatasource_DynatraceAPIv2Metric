import { FieldType, MutableDataFrame } from '@grafana/data';
import { getBackendSrv, isFetchError } from '@grafana/runtime';


export default class DataSource {
  constructor(instanceSettings, $q, backendSrv, templateSrv) {
    this.baseUrl = instanceSettings.url;
    this.token = instanceSettings.jsonData.token;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
    this.getBackendSrv = getBackendSrv;
    this.metrics = [];
  }
  async fetchAllMetrics(pageKey = null) {
    let metrics = [];
    try {
      let url = '/api/v2/metrics';
      if (pageKey) {
        url += `?nextPageKey=${pageKey}`;
      }
      const response = await this.request(url);
      if (response.status === 200 && response.data && response.data.metrics) {
        metrics = response.data.metrics.map(metric => ({
          text: metric.displayName,
          value: metric.metricId,
        }));
        if (response.data.nextPageKey) {
          // Fetch the next page of results
          const nextPageMetrics = await this.fetchAllMetrics(response.data.nextPageKey);
          metrics = metrics.concat(nextPageMetrics);
        }
      }
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
    }
    return metrics;
  }
  async query(options) {
    try {
      if (options.targets[0].customQuery && options.targets[0].customQuery.length) {
        const queryUrl = `/api/v2/metrics/query?query=${options.targets[0].customQuery}`;
        console.log('Making request to:', queryUrl);
        const response = await this.request(queryUrl);
        console.log('Response:', response);
        const metricData = response.data.result[0].data;
        const frames = metricData.map((metric) => {
          const { timestamps, values, dimensions } = metric;
          const repeatedDimensions = Array(timestamps.length).fill(dimensions[0]);
          return new MutableDataFrame({
            refId: options.targets[0].refId,
            name: dimensions[0],
            fields: [
              { name: 'Time', type: FieldType.time, values: timestamps },
              { name: 'Value', type: FieldType.number, values },
              { name: 'Dimension', type: FieldType.string, values: repeatedDimensions },
            ],
          });
        });
        return { data: frames };
      }
      console.log('Query options:', options);
      const promises = options.targets
        .filter(target => target.metric && target.metric.length > 0)
        .map(async (target) => {
          let queryUrl = `/api/v2/metrics/query?metricSelector=${target.metric}&from=${options.range.from.toISOString()}&to=${options.range.to.toISOString()}`;
          if (target.splitBy) {
            queryUrl += `&splitBy=${target.splitBy}`;
          }
          if (target.filterCriteria && target.filterValue) {
            const filterCriteria = encodeURIComponent(target.filterCriteria);
            const filterValue = encodeURIComponent(target.filterValue);
            queryUrl += `&entitySelector=${filterCriteria}:${filterValue}`;
          }
          console.log('Making request to:', queryUrl);
          const response = await this.request(queryUrl);
          console.log('Response:', response);
          const metricData = response.data.result[0].data;
          const frames = metricData.map((metric) => {
            const { timestamps, values, dimensions } = metric;
            const repeatedDimensions = Array(timestamps.length).fill(dimensions[0]);
            return new MutableDataFrame({
              refId: target.refId,
              name: dimensions[0],
              fields: [
                { name: 'Time', type: FieldType.time, values: timestamps },
                { name: 'Value', type: FieldType.number, values },
                { name: 'Dimension', type: FieldType.string, values: repeatedDimensions },
              ],
            });
          });
          return frames;
        });
      return Promise.all(promises).then(data => ({ data: data.flat() }));
    } catch (error) {
      console.error('Error during query:', error);
      throw error;
    }
  }
  async metricFindQuery(query) {
    try {
      const response = await this.request(`/api/v2/metrics?text=${query}`);
      console.log('Response:', response);
      if (response.status !== 200 || !response.data || !response.data.metrics) {
        return [];
      }
      return response.data.metrics.map(metric => (
        {
          text: metric.displayName,
          value: metric.metricId,
        }
      ));
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
      return [];
    }
  }
  async fetchMetricDimensions(metricId) {
    const url = `/api/v2/metrics/${metricId}`;
    const response = await this.request(url);
    if (response.status !== 200 || !response.data || !response.data.dimensionDefinitions) {
      return [];
    }
    return response.data.dimensionDefinitions.map(def => ({
      text: def.displayName,
      value: def.key,
    }));
  }
  async request(url, params) {
    try {
      const fullUrl = `${this.baseUrl}${url}${params ? `&${params}` : ''}`;
      console.log('Making request:', fullUrl);
      const response = await getBackendSrv().fetch({
        url: fullUrl,
        headers: {
          Authorization: `Api-Token ${this.token}`,
        },
      }).toPromise();
      console.log('Received response:', response);
      if (response.ok) {
        return response;
      }
      console.error(`Failed to fetch data. Status: ${response.status}`);
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    } catch (error) {
      console.error('Error making request:', error);
      throw error; // re-throw the error to be caught and handled elsewhere
    }
  }
  async testDatasource() {
    const defaultErrorMessage = 'Cannot connect to APIs';

    try {
      const response = await this.request('/api/v2/metrics');
      if (response.status === 200) {
        return {
          status: 'success',
          message: 'Successoooo',
        };
      }
      return {
        status: 'error',
        message: response.statusText || defaultErrorMessage,
      };
    } catch (err) {
      let message = '';
      if (typeof err === 'string') {
        message = err;
      } else if (isFetchError(err)) {
        message = `Fetch error: ${err.statusText || defaultErrorMessage}`;
        if (err.data && err.data.error && err.data.error.code) {
          message += `: ${err.data.error.code}. ${err.data.error.message}`;
        }
      }
      return {
        status: 'error',
        message,
      };
    }
  }
}
