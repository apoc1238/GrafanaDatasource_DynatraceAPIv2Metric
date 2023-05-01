'use strict';

System.register(['@grafana/data', '@grafana/runtime'], function (_export, _context) {
  "use strict";

  var FieldType, MutableDataFrame, getBackendSrv, isFetchError, _createClass, DataSource;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_grafanaData) {
      FieldType = _grafanaData.FieldType;
      MutableDataFrame = _grafanaData.MutableDataFrame;
    }, function (_grafanaRuntime) {
      getBackendSrv = _grafanaRuntime.getBackendSrv;
      isFetchError = _grafanaRuntime.isFetchError;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      DataSource = function () {
        function DataSource(instanceSettings) {
          _classCallCheck(this, DataSource);

          this.baseUrl = instanceSettings.url;
        }

        _createClass(DataSource, [{
          key: 'query',
          value: async function query(options) {
            var _this = this;

            var promises = options.targets.map(async function (_ref) {
              var queryText = _ref.queryText,
                  refId = _ref.refId;

              var response = await _this.request('/api/v2/metrics/query?metricSelector=' + queryText + '&from=' + options.range.from.toISOString() + '&to=' + options.range.to.toISOString());
              var metricData = response.data.result[0].data;

              var frames = metricData.map(function (metric) {
                var timestamps = metric.timestamps,
                    values = metric.values;


                return new MutableDataFrame({
                  refId: refId,
                  fields: [{ name: 'Time', type: FieldType.time, values: timestamps }, { name: 'Value', type: FieldType.number, values: values }]
                });
              });

              return frames;
            });

            return Promise.all(promises).then(function (data) {
              return { data: data.flat() };
            });
          }
        }, {
          key: 'request',
          value: async function request(url, params) {
            var response = getBackendSrv().fetch({
              url: '' + this.baseUrl + url + (params ? '&' + params : ''),
              headers: {
                Authorization: 'Api-Token dt0c01.....'
              }
            });
            return response.toPromise();
          }
        }, {
          key: 'testDatasource',
          value: async function testDatasource() {
            var defaultErrorMessage = 'Cannot connect to API';

            try {
              var response = await this.request('/api/v2/metrics');
              if (response.status === 200) {
                return {
                  status: 'success',
                  message: 'Success'
                };
              }
              return {
                status: 'error',
                message: response.statusText || defaultErrorMessage
              };
            } catch (err) {
              var message = '';
              if (typeof err === 'string') {
                message = err;
              } else if (isFetchError(err)) {
                message = 'Fetch error: ' + (err.statusText || defaultErrorMessage);
                if (err.data && err.data.error && err.data.error.code) {
                  message += ': ' + err.data.error.code + '. ' + err.data.error.message;
                }
              }
              return {
                status: 'error',
                message: message
              };
            }
          }
        }]);

        return DataSource;
      }();

      _export('default', DataSource);
    }
  };
});
//# sourceMappingURL=datasource.js.map
