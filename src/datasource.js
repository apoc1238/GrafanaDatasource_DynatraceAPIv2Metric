import { FieldType, MutableDataFrame } from '@grafana/data';
import { getBackendSrv, isFetchError } from '@grafana/runtime';

export default class DataSource {
  constructor(instanceSettings) {
    this.baseUrl = instanceSettings.url;
  }

  async query(options) {
    const promises = options.targets.map(async ({ queryText, refId }) => {
      const response = await this.request(`/api/v2/metrics/query?metricSelector=${queryText}&from=${options.range.from.toISOString()}&to=${options.range.to.toISOString()}`);
      const metricData = response.data.result[0].data;

      const frames = metricData.map((metric) => {
        const { timestamps, values } = metric;

        return new MutableDataFrame({
          refId,
          fields: [
            { name: 'Time', type: FieldType.time, values: timestamps },
            { name: 'Value', type: FieldType.number, values },
          ],
        });
      });

      return frames;
    });

    return Promise.all(promises).then(data => ({ data: data.flat() }));
  }


  async request(url, params) {
    const response = getBackendSrv().fetch({
      url: `${this.baseUrl}${url}${params ? `&${params}` : ''}`,
      headers: {
        Authorization: 'Api-Token dt0c01........',
      },
    });
    return response.toPromise();
  }

  async testDatasource() {
    const defaultErrorMessage = 'Cannot connect to API';

    try {
      const response = await this.request('/api/v2/metrics');
      if (response.status === 200) {
        return {
          status: 'success',
          message: 'Success',
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
