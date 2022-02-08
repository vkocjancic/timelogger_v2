using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace TimeLogger_v2.Core.DAL.TimeLog
{
    public interface ITimeEntryService
    {

        Task<IEnumerable<TimeEntry>> GetAllUserEntriesForDate(string username, DateTime dateOfEntries);
        Task<Guid> CreateEntry(string username, TimeEntry entry);
        Task<bool> UpdateEntry(string username, TimeEntry entry);
    }
}
