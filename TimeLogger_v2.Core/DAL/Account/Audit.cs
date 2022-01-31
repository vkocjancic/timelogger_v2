using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Net;
using System.Text;

namespace TimeLogger_v2.Core.DAL.Account
{
    public class Audit : BusinessBase
    {

        #region Declarations

        public static string Collection = "Audits";

        #endregion

        #region Properties

        public string IpAddress { get; set; }
        public bool IsSuccessful { get; set; }
        public DateTime Timestamp { get; set; }
        public string Username { get; set; }

        #endregion

    }
}
