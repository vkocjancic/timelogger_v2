using LiteDB;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Timelogger_v2.Database;
using TimeLogger_v2.Core.DAL.Insights;

namespace TimeLogger_v2.Database.Insights
{
    public class InsightsService : UserServiceBase, IInsightsService
    {

        #region Declarations

        private ILogger<InsightsService> _logger;

        #endregion

        #region Constructors

        public InsightsService(ILogger<InsightsService> logger)
        {
            _logger = logger;
        }

        #endregion

        #region IInsightsService implementation

        public async Task<IEnumerable<ChartData>> GetChartData(string username, DateTime dateStart, DateTime dateEnd)
        {
            List<ChartData> entries = null;
            await Task.Run(() =>
            {
                var sw = Stopwatch.StartNew();
                var databaseName = GetDatabaseFullNameForUser(username);
                using (var db = new LiteDatabase(databaseName))
                {
                    var colEntries = db.GetCollection<TimeLogger_v2.Core.DAL.TimeLog.TimeEntry>(TimeLogger_v2.Core.DAL.TimeLog.TimeEntry.Collection);
                    IEnumerable<IGrouping<DateTime, TimeLogger_v2.Core.DAL.TimeLog.TimeEntry>> grouped = null;
                    if (dateStart.AddMonths(6).Date > dateEnd.Date)
                    {
                        // group by days
                        grouped = colEntries
                            .Find(e => e.Begin.Value.Date >= dateStart.Date && e.End.HasValue && e.End.Value.Date <= dateEnd.Date)
                            .GroupBy(e => e.Begin.Value.Date);
                    }
                    else
                    {
                        // group by months
                        grouped = colEntries
                            .Find(e => e.Begin.Value.Date >= dateStart.Date && e.End.HasValue && e.End.Value.Date <= dateEnd.Date)
                            .GroupBy(e => new DateTime(e.Begin.Value.Date.Year, e.Begin.Value.Date.Month, 1));
                    }
                    var tags = new List<string>();
                    entries = grouped.Select(g => new ChartData()
                        {
                            Label = g.Key,
                            TotalMinutes = Convert.ToDecimal(g.Sum(e => (e.End.Value - e.Begin.Value).TotalMinutes)),
                            TotalTags = g.Sum(e => {
                                var cnTags = 0;
                                foreach (var tag in e.Tags?.Where(t => !tags.Contains(t.Name)) ?? new Core.DAL.TimeLog.Tag[] { new Core.DAL.TimeLog.Tag("General") })
                                {
                                    tags.Add(tag.Name);
                                    cnTags++;
                                }
                                return cnTags;
                            }),
                            TotalTasks = g.Count()
                        })
                    .OrderBy(e => e.Label)
                    .ToList();
                }
                sw.Stop();
                _logger.LogDebug("{0} ms\tGetChartData", sw.ElapsedMilliseconds);
            });
            return entries;
        }

        public async Task<IEnumerable<ReportItem>> GetReportData(string username, DateTime dateStart, DateTime dateEnd)
        {
            List<ReportItem> items = new List<ReportItem>();
            await Task.Run(() =>
            {
                var sw = Stopwatch.StartNew();
                var databaseName = GetDatabaseFullNameForUser(username);
                using (var db = new LiteDatabase(databaseName))
                {
                    var colEntries = db.GetCollection<TimeLogger_v2.Core.DAL.TimeLog.TimeEntry>(TimeLogger_v2.Core.DAL.TimeLog.TimeEntry.Collection);
                    var entries = colEntries
                        .Find(e => e.Begin.Value.Date >= dateStart.Date && e.End.HasValue && e.End.Value.Date <= dateEnd.Date);
                    foreach(var timeEntry in entries)
                    {
                        if (null == timeEntry.Tags)
                        {
                            timeEntry.Tags = new List<Core.DAL.TimeLog.Tag>() { new Core.DAL.TimeLog.Tag("General") };
                        }
                        foreach (var tag in timeEntry.Tags)
                        {
                            var item = items?.FirstOrDefault(i => i.Tag.Equals(tag.Name, StringComparison.InvariantCultureIgnoreCase));
                            if (null == item)
                            {
                                item = new ReportItem() { Tag = tag.Name, Duration = 0M };
                                items.Add(item);
                            }
                            item.Duration += Convert.ToDecimal((timeEntry.End.Value - timeEntry.Begin.Value).TotalMinutes);
                        }
                    }
                }
                sw.Stop();
                _logger.LogDebug("{0} ms\tGetReportData", sw.ElapsedMilliseconds);
            });
            return items.OrderByDescending(i => i.Duration).ThenBy(i => i.Tag).Take(10).ToList();
        } 

        #endregion

    }
}
