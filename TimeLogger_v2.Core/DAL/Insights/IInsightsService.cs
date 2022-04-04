using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace TimeLogger_v2.Core.DAL.Insights
{
    public interface IInsightsService
    {

        Task<IEnumerable<ChartData>> GetChartData(string name, DateTime dateStart, DateTime dateEnd);
        Task<IEnumerable<ReportItem>> GetReportData(string name, DateTime dateStart, DateTime dateEnd);

    }

}
