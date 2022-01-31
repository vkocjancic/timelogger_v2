﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using TimeLogger_v2.App.Model;
using TimeLogger_v2.Core.DAL.TimeLog;

namespace TimeLogger_v2.App.Controllers
{

    [Route("api/[controller]/[action]")]
    [ApiController]
    public class TimeEntryController : Controller
    {

        #region Declarations

        private readonly ILogger<TimeEntryController> _logger;
        private readonly ITimeEntryService _timeEntryService;

        #endregion

        #region Constructors

        public TimeEntryController(ILogger<TimeEntryController> logger, ITimeEntryService timeEntryService)
        {
            _logger = logger;
            _timeEntryService = timeEntryService;
        }

        #endregion

        #region API methods

        [HttpGet]
        public async Task<IActionResult> List([FromQuery] string selectedDate)
        {
            var remoteIpAddress = Request.HttpContext.Connection.RemoteIpAddress;
            _logger.LogDebug("{0}\tList time entries for user '{1}' and date '{2}'", remoteIpAddress, Request.HttpContext.User.Identity.Name, selectedDate);
            DateTime dateSelected = string.IsNullOrEmpty(selectedDate) ? DateTime.Today : DateTime.ParseExact(selectedDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
            var entriesFromDb = await _timeEntryService.GetAllUserEntriesForDate(Request.HttpContext.User.Identity.Name, dateSelected);
            var entries = new List<TimeEntryModel>(entriesFromDb.Count());
            foreach (var entry in entriesFromDb)
            {
                entries.Add(new TimeEntryModel(entry));
            }
            _logger.LogInformation("{0}\tList time entries for user '{1}' and date '{2}' found {3} time entries(s)", remoteIpAddress, Request.HttpContext.User.Identity.Name, selectedDate, entries.Count);
            return Ok(entries);
        }

        #endregion

    }
}
