using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace TimeLogger_v2.App.Model
{
    public class InsightsModel
    {

        #region Properties

        [JsonPropertyName("chartData")]
        public InsightsChartDataModel ChartData { get; set; }

        [JsonPropertyName("reportData")]
        public IEnumerable<InsightsReportItemModel> ReportData { get; set; }

        #endregion

    }

}
