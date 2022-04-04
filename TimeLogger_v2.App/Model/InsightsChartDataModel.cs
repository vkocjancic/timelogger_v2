using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace TimeLogger_v2.App.Model
{
    public class InsightsChartDataModel
    {

        #region Properties

        [JsonPropertyName("datasets")]
        public IEnumerable<InsightsChartDataSetModel> DataSets { get; set; }

        [JsonPropertyName("labels")]
        public IEnumerable<string> Labels { get; set; }

        #endregion

    }
}
