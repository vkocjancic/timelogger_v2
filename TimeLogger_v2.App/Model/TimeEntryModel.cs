using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using TimeLogger_v2.Core.DAL.TimeLog;

namespace TimeLogger_v2.App.Model
{
    public class TimeEntryModel
    {

        #region Properties

        [JsonPropertyName("id")]
        public Guid Id { get; set; }

        [JsonPropertyName("begin")]
        public string BeginIsoDateTime { get; set; }

        [JsonPropertyName("end")]
        public string EndIsoDateTime { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }

        #endregion

        #region Constructors

        public TimeEntryModel() { }

        #endregion

    }
}
