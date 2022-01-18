using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TimeLogger_v2.App.Model;

namespace TimeLogger_v2.App.Controllers
{

    [Route("api/[controller]/[action]")]
    [ApiController]
    public class TimeEntryController : Controller
    {

        #region Declarations

        private readonly ILogger<TimeEntryController> _logger;

        #endregion

        #region Constructors

        public TimeEntryController(ILogger<TimeEntryController> logger)
        {
            _logger = logger;
        }

        #endregion

        #region API methods

        [HttpGet]
        public /*async*/ Task<IActionResult> List()
        {
            var remoteIpAddress = Request.HttpContext.Connection.RemoteIpAddress;
            _logger.LogDebug("{0}\tList time entries for user '{1}'", remoteIpAddress, Request.HttpContext.User.Identity.Name);
            var timeEntries = new List<TimeEntryModel>()
            {
                new TimeEntryModel() { Id = Guid.NewGuid(), BeginIsoDateTime = "2022-01-18 08:00:00", EndIsoDateTime = "2022-01-18 10:35:00", Description="Worked on some important stuff #General _Task1" },
                new TimeEntryModel() { Id = Guid.NewGuid(), BeginIsoDateTime = "2022-01-18 10:35:00", EndIsoDateTime = "2022-01-18 11:57:00", Description="Worked on some non-important stuff #General _Task2" },
            };
            _logger.LogInformation("{0}\tList time entries for user '{1}' found {2} time entries(s)", remoteIpAddress, Request.HttpContext.User.Identity.Name, timeEntries.Count);
            return Task.FromResult((IActionResult)Ok(timeEntries));
        }

        #endregion

    }
}
