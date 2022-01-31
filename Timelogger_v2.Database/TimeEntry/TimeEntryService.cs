using LiteDB;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Timelogger_v2.Database;
using TimeLogger_v2.Core.DAL.TimeLog;

namespace TimeLogger_v2.Database.TimeEntry
{
    public class TimeEntryService : UserServiceBase, ITimeEntryService
    {

        #region Declarations

        private ILogger<TimeEntryService> _logger;

        #endregion

        #region Constructors

        public TimeEntryService(ILogger<TimeEntryService> logger)
        {
            _logger = logger;
        }

        #endregion

        #region ITimeEntryService implementation

        public async Task<IEnumerable<TimeLogger_v2.Core.DAL.TimeLog.TimeEntry>> GetAllUserEntriesForDate(string username, DateTime dateOfEntries)
        {
            List<TimeLogger_v2.Core.DAL.TimeLog.TimeEntry> entries = null;
            await Task.Run(() =>
            {
                var sw = Stopwatch.StartNew();
                var databaseName = GetDatabaseFullNameForUser(username);
                using (var db = new LiteDatabase(databaseName))
                {
                    var colEntries = db.GetCollection<TimeLogger_v2.Core.DAL.TimeLog.TimeEntry>(TimeLogger_v2.Core.DAL.TimeLog.TimeEntry.Collection);
                    entries = colEntries
                        .Find(e => e.Begin >= dateOfEntries && (!e.End.HasValue || e.End <= dateOfEntries))
                        .OrderBy(d => d.Begin)
                        .ToList();
                }
                sw.Stop();
                _logger.LogDebug("{0} ms\tGetAllUserEntriesForDate", sw.ElapsedMilliseconds);
            });
            return entries;
        }

        #endregion

    }
}
