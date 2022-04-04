using System;
using System.Collections.Generic;
using System.Text;

namespace TimeLogger_v2.Core.DAL.Insights
{
    public class ChartData
    {

        #region Properties

        public DateTime Label { get; set; }

        public int TotalTags { get; set; }

        public int TotalTasks { get; set; }

        public decimal TotalMinutes { get; set; }

        #endregion

    }
}
