using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using TimeLogger_v2.Core.DAL.Account;
using TimeLogger_v2.Core.Templating;

namespace TimeLogger_v2.Core.Notifications
{
    public class PasswordChangedNotification : NotificationBase
    {

        #region Declarations

        protected PasswordReset _pwdReset;

        #endregion

        #region Constructors

        public PasswordChangedNotification(SmtpOptions options, TemplateHelperBase templateHelper, PasswordReset pwdReset) : base(options, templateHelper) => _pwdReset = pwdReset;

        #endregion

        #region NotificationBase implementation

        public override async Task<string> GenerateMessageContent()
        {
            Subject = "TimeLogger: Password changed";
            var tagReplacements = new Dictionary<string, string>();
            tagReplacements.Add("EMAIL", _pwdReset.Username);
            return await GenerateMessageContent("passwordchanged.html", tagReplacements);
        }

        #endregion
    }
}
