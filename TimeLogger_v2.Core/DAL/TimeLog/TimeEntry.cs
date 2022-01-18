﻿using System;
using System.Collections.Generic;
using System.Text;
using Timelogger_v2.Core.DAL;

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

        #endregion

    }

}
