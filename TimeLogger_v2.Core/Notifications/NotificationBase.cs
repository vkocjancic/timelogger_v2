using MailKit.Net.Smtp;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using TimeLogger_v2.Core.Templating;

namespace TimeLogger_v2.Core.Notifications
{
    public abstract class NotificationBase
    {

        #region Declarations

        protected SmtpOptions _options;
        protected TemplateHelperBase _templateHelper;

        #endregion

        #region Properties

        protected string Subject { get; set; }
        protected string From { get; set; }

        #endregion

        #region Constructors

        public NotificationBase(SmtpOptions options, TemplateHelperBase templateHelper)
        {
            _options = options;
            _templateHelper = templateHelper;
        }

        #endregion

        #region Public methods

        public async Task SendAsync(string recipient)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_options.From, _options.From));
            message.To.Add(new MailboxAddress(recipient, recipient));
            message.Bcc.Add(new MailboxAddress("Timelogger info", "info@timelogger.eu"));
            message.Body = new TextPart(MimeKit.Text.TextFormat.Html)
            {
                Text = await GenerateMessageContent()
            };
            message.Subject = Subject;
            using(var client = new SmtpClient())
            {
                client.ServerCertificateValidationCallback = (s, c, h, e) => true;
                await client.ConnectAsync(_options.Server, _options.Port, false);
                client.AuthenticationMechanisms.Remove("XOAUTH2");
                await client.AuthenticateAsync(_options.Username, _options.Password);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
        }

        #endregion

        #region Abstract methods

        public abstract Task<string> GenerateMessageContent();

        #endregion

        #region Protected methods

        protected async Task<string> GenerateMessageContent(string template, IDictionary<string, string> tagDictionary)
        {
            await _templateHelper.ReadTemplateAsync(template);
            await _templateHelper.ReplaceTags(tagDictionary);
            return _templateHelper.PrintBuffer();
        }

        #endregion

    }
}
