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
    public class TimeEntryAdapter : AdapterBase<TimeEntryModel, TimeEntry>
    {

        #region Declarations


        #endregion

        #region IAdapeter implementation

        public override TimeEntryModel FromDomain(TimeEntry domain)
        {
            return new TimeEntryModel()
            {
                Id = domain.Id,
                BeginIsoDateTime = domain.Begin?.ToString("yyyy-MM-dd HH:mm:ss"),
                EndIsoDateTime = domain.End?.ToString("yyyy-MM-dd HH:mm:ss"),
                Description = domain.Description
            };
        }

        public override TimeEntry ToDomain(TimeEntryModel model)
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
            domain.Tags = new List<Tag>();
            if (!string.IsNullOrEmpty(domain.Description))
            {
                foreach (Match match in Regex.Matches(domain.Description, @"(\#|\>)\S+"))
                {
                    domain.Tags.Add(new Tag(match.Value.Substring(1)));
                }
            }
            return domain;
        }

        #endregion

    }

}
