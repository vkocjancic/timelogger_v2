using System;
using System.Collections.Generic;
using System.Text;
using TimeLogger_v2.Core.DAL;

namespace TimeLogger_v2.Core.DAL.TimeLog
{
    public class TimeEntry : BusinessBase
    {

        #region Declarations

        public static string Collection = "TimeEntries";

        #endregion

        #region Properties

        public DateTime? Begin { get; set; }

        public DateTime? End { get; set; }

        public string Description { get; set; }

        public List<Tag> Tags { get; set; }

        #endregion

        #region Public methods

        public bool IsValid(out string error)
        {
            error = "";
            if (Begin.HasValue && End.HasValue && Begin.Value > End.Value)
            {
                error = "ERR_TIME_ENTRY_END_BEFORE_BEGIN";
                return false;
            }
            return true;
        }

        #endregion

    }

}
