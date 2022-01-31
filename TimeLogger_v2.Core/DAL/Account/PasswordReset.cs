using System;
using System.Collections.Generic;
using System.Text;

namespace TimeLogger_v2.Core.DAL.Account
{
    public class PasswordReset : BusinessBase
    {

        #region Declarations

        public static string Collection = "PasswordReset";

        #endregion

        #region Properties

        public string IpAddress { get; set; }
        public bool IsUsed { get; set; }
        public DateTime Timestamp { get; set; }
        public string Username { get; set; }

        #endregion

    }

}
