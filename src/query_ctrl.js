import { QueryCtrl } from 'app/plugins/sdk';
import './css/query-editor.css!';

export default class DynatraceDatasourceQueryCtrl extends QueryCtrl {
  constructor($scope, $injector) {
    super($scope, $injector);
    this.scope = $scope;
    this.target.metric = this.target.metric || '';
    this.target.splitBy = this.target.splitBy || '';
    this.target.filterCriteria = this.target.filterCriteria || '';
    this.target.filterValue = this.target.filterValue || '';
  }

  getMetricList() {
    return this.datasource.fetchAllMetrics();
  }
  getSplitByOptions() {
    if (!this.target.metric) {
      return [];
    }
    return this.datasource.fetchMetricDimensions(this.target.metric);
  }
  onChangeInternal() {
    this.panelCtrl.refresh();
  }
}

DynatraceDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';
