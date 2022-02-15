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

        public async Task<Guid> CreateEntry(string username, Core.DAL.TimeLog.TimeEntry entry)
        {
            var id = Guid.NewGuid();
            await Task.Run(() =>
            {
                var sw = Stopwatch.StartNew();
                var databaseName = GetDatabaseFullNameForUser(username);
                using (var db = new LiteDatabase(databaseName))
                {
                    var colEntries = db.GetCollection<TimeLogger_v2.Core.DAL.TimeLog.TimeEntry>(TimeLogger_v2.Core.DAL.TimeLog.TimeEntry.Collection);
                    colEntries.Insert(entry);
                    colEntries.EnsureIndex(e => e.UniqueId);
                }
                sw.Stop();
                _logger.LogDebug("{0} ms\tCreateEntry", sw.ElapsedMilliseconds);
            });
            return id;
        }

        public async Task<bool> DeleteEntry(string username, Core.DAL.TimeLog.TimeEntry entry)
        {
            var result = true;
            await Task.Run(() =>
            {
                var sw = Stopwatch.StartNew();
                var databaseName = GetDatabaseFullNameForUser(username);
                using (var db = new LiteDatabase(databaseName))
                {
                    var colEntries = db.GetCollection<TimeLogger_v2.Core.DAL.TimeLog.TimeEntry>(TimeLogger_v2.Core.DAL.TimeLog.TimeEntry.Collection);
                    colEntries.DeleteMany(e => e.UniqueId == entry.UniqueId);
                }
                sw.Stop();
                _logger.LogDebug("{0} ms\tDeleteEntry", sw.ElapsedMilliseconds);
            });
            return result;
        }

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
                        .Find(e => e.Begin.Value.Date == dateOfEntries.Date && (!e.End.HasValue || e.End.Value.Date == dateOfEntries.Date))
                        .OrderBy(d => d.Begin)
                        .ToList();
                }
                sw.Stop();
                _logger.LogDebug("{0} ms\tGetAllUserEntriesForDate", sw.ElapsedMilliseconds);
            });
            return entries;
        }

        public async Task<bool> UpdateEntry(string username, Core.DAL.TimeLog.TimeEntry entry)
        {
            var result = true;
            await Task.Run(() =>
            {
                var sw = Stopwatch.StartNew();
                var databaseName = GetDatabaseFullNameForUser(username);
                using (var db = new LiteDatabase(databaseName))
                {
                    var colEntries = db.GetCollection<TimeLogger_v2.Core.DAL.TimeLog.TimeEntry>(TimeLogger_v2.Core.DAL.TimeLog.TimeEntry.Collection);
                    var entryFromDb = colEntries
                        .FindOne(e => e.UniqueId == entry.UniqueId);
                    if (null == entryFromDb)
                    {
                        result = false;
                    }
                    else
                    {
                        entryFromDb.Begin = entry.Begin;
                        entryFromDb.Description = entry.Description;
                        entryFromDb.End = entry.End;
                        entryFromDb.Tags = new List<Tag>();
                        entryFromDb.Tags.AddRange(entry.Tags);
                        colEntries.Update(entryFromDb);
                        colEntries.EnsureIndex(e => e.UniqueId);
                    }
                }
                sw.Stop();
                _logger.LogDebug("{0} ms\tUpdateEntry", sw.ElapsedMilliseconds);
            });
            return result;
        }

        #endregion

    }
}
