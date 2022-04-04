using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace TimeLogger_v2.App.Model
{
    public class InsightsChartDataSetModel
    {

        #region Properties

        [JsonPropertyName("label")]
        public string Label { get; set; }

        [JsonPropertyName("data")]
        public IEnumerable<decimal> Data { get; set; }

        #endregion

    }
}
