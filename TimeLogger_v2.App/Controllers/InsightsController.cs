using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using TimeLogger_v2.App.Adapter;
using TimeLogger_v2.App.Model;
using TimeLogger_v2.Core.DAL.Insights;

namespace TimeLogger_v2.App.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class InsightsController : Controller
    {

        #region Declarations

        private readonly ILogger<InsightsController> _logger;
        private readonly IInsightsService _insightsService;

        #endregion

        #region Constructors

        public InsightsController(ILogger<InsightsController> logger, IInsightsService insightsService)
        {
            _logger = logger;
            _insightsService = insightsService;
        }

        #endregion

        #region API methods

        [HttpGet]
        public async Task<IActionResult> List([FromQuery] string startDate, [FromQuery] string endDate)
        {
            var remoteIpAddress = Request.HttpContext.Connection.RemoteIpAddress;
            _logger.LogDebug("{0}\tList insights for user '{1}' and date range '{2}'-'{3}'", remoteIpAddress, Request.HttpContext.User.Identity.Name, startDate, endDate);
            DateTime dateStart = string.IsNullOrEmpty(startDate) ? DateTime.Today.AddDays(-7) : DateTime.ParseExact(startDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
            DateTime dateEnd = string.IsNullOrEmpty(startDate) ? DateTime.Today : DateTime.ParseExact(endDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
            IEnumerable<ChartData> chartDataFromDb = await _insightsService.GetChartData(Request.HttpContext.User.Identity.Name, dateStart, dateEnd);
            IEnumerable<ReportItem> reportDataFromDb = await _insightsService.GetReportData(Request.HttpContext.User.Identity.Name, dateStart, dateEnd);
            var insights = new InsightsModel();
            var adapterChartData = new InsightsChartDataAdapter();
            insights.ChartData = adapterChartData.FromDomain(chartDataFromDb, dateStart, dateEnd);
            var adapterReportData = new InsightsReportDataAdapter();
            insights.ReportData = adapterReportData.FromDomainBulk(reportDataFromDb);
            _logger.LogInformation("{0}\tList time entries for user '{1}' and date range '{2}'-'{3}' completed", remoteIpAddress, Request.HttpContext.User.Identity.Name, startDate, endDate);
            return Ok(insights);
        }

        #endregion

    }
}
