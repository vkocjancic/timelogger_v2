using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace TimeLogger_v2.App.Model
{
    public class PlanModel
    {

        #region Properties

        [JsonPropertyName("code")]
        public string Code { get; set; }

        [JsonPropertyName("currency")]
        public string CurrencySymbol { get; set; } = "€";

        [JsonPropertyName("expires")]
        public int ExpireYears { get; set; }

        [JsonPropertyName("info")]
        public string[] Info { get; set; }

        [JsonPropertyName("mode")]
        public int Mode { get; set; } = -1;
        
        [JsonPropertyName("price")]
        public decimal Price { get; set; }

        [JsonPropertyName("title")]
        public string Title { get; set; }

        #endregion

    }
}
