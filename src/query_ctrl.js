import { QueryCtrl } from 'app/plugins/sdk';
import './css/query-editor.css!';

export default class DynatraceDatasourceQueryCtrl extends QueryCtrl {
  constructor($scope, $injector) {
    super($scope, $injector);

    this.scope = $scope;
    this.target.queryText = this.target.queryText || '';
    this.target.alias = this.target.alias || '';
  }

  getMetricList() {
    return this.datasource.metricFindQuery();
  }

  onChangeInternal() {
    this.panelCtrl.refresh();
  }
}

DynatraceDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';
