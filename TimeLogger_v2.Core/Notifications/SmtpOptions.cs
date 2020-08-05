using System;
using System.Collections.Generic;
using System.Text;

namespace TimeLogger_v2.Core.Notifications
{
    public class SmtpOptions
    {

        #region Declarations

        public string From { get; set; }
        public string Server { get; set; }
        public int Port { get; set; } = 25;
        public string Username { get; set; }
        public string Password { get; set; }

        #endregion

    }
}
