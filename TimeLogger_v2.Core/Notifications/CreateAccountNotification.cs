using System.Collections.Generic;
using System.Threading.Tasks;
using TimeLogger_v2.Core.Templating;

namespace TimeLogger_v2.Core.Notifications
{
    public class CreateAccountNotification : NotificationBase
    {

        #region Constructors

        public CreateAccountNotification(SmtpOptions options, TemplateHelperBase templateHelper) : base(options, templateHelper) { }

        #endregion

        #region NotificationBase implementation

        public override async Task<string> GenerateMessageContent()
        {
            Subject = "TimeLogger: New account notification";
            var tagReplacements = new Dictionary<string, string>();
            return await GenerateMessageContent("createnewaccount.html", tagReplacements);
        }

        #endregion
    }
}
