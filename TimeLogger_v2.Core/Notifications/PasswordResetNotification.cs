using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using TimeLogger_v2.Core.DAL.Account;
using TimeLogger_v2.Core.Templating;

namespace TimeLogger_v2.Core.Notifications
{
    public class PasswordResetNotification : NotificationBase
    {

        #region Declarations

        protected PasswordReset _pwdReset;

        #endregion

        #region Constructors

        public PasswordResetNotification(SmtpOptions options, TemplateHelperBase templateHelper, PasswordReset pwdReset) : base(options, templateHelper) => _pwdReset = pwdReset;

        #endregion

        #region NotificationBase implementation

        public override async Task<string> GenerateMessageContent()
        {
            Subject = "TimeLogger: Password reset request";
            var tagReplacements = new Dictionary<string, string>();
            tagReplacements.Add("ID", _pwdReset.UniqueId.ToString());
            return await GenerateMessageContent("passwordreset.html", tagReplacements);
        }

        #endregion
    }
}
