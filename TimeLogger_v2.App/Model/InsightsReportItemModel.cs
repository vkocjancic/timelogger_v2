using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace TimeLogger_v2.App.Model
{
    public class InsightsReportItemModel
    {

        #region Properties

        [JsonPropertyName("tag")]
        public string Tag { get; set; }
        
        [JsonPropertyName("duration")]
        public decimal Duration { get; set; }

        #endregion

    }

}
