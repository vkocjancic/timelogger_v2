using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using TimeLogger_v2.App.Model;
using TimeLogger_v2.Core.DAL.Project;
using TimeLogger_v2.Core.DAL.TimeLog;

namespace TimeLogger_v2.App.Adapter
{
    public class TimeEntryAdapter : IAdapter<TimeEntryModel, TimeEntry>
    {

        #region Declarations


        #endregion

        #region IAdapeter implementation

        public TimeEntryModel FromDomain(TimeEntry domain)
        {
            return new TimeEntryModel()
            {
                Id = domain.Id,
                BeginIsoDateTime = domain.Begin?.ToString("yyyy-MM-dd HH:mm:ss"),
                EndIsoDateTime = domain.End?.ToString("yyyy-MM-dd HH:mm:ss"),
                Description = domain.Description
            };
        }

        public TimeEntry ToDomain(TimeEntryModel model)
        {
            var domain = new TimeEntry()
            {
                Description = model.Description
            };
            if (!string.IsNullOrEmpty(model.BeginIsoDateTime))
            {
                domain.Begin = DateTime.ParseExact(model.BeginIsoDateTime, "yyyy-MM-dd HH:mm", CultureInfo.InvariantCulture);
            }
            if (!string.IsNullOrEmpty(model.EndIsoDateTime))
            {
                domain.End = DateTime.ParseExact(model.EndIsoDateTime, "yyyy-MM-dd HH:mm", CultureInfo.InvariantCulture);
            }
            if (model.Id != Guid.Empty)
            {
                domain.Id = model.Id;
            }
            domain.Projects = new List<Project>();
            domain.Tasks = new List<Core.DAL.Project.Task>();
            if (!string.IsNullOrEmpty(domain.Description))
            {
                foreach (Match match in Regex.Matches(domain.Description, @"\#\S+"))
                {
                    domain.Projects.Add(new Project() { Name = match.Value.Substring(1) });
                }
                foreach (Match match in Regex.Matches(domain.Description, @"\>\S+"))
                {
                    domain.Tasks.Add(new Core.DAL.Project.Task() { Name = match.Value.Substring(1) });
                }
            }
            return domain;
        }

        #endregion

    }

}
