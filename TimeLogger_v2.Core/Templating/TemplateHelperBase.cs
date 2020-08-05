using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace TimeLogger_v2.Core.Templating
{
    public abstract class TemplateHelperBase : ITemplateHelper
    {

        #region Declarations

        protected string _templateContent;
        protected string _templateBuffer;

        #endregion

        #region ITemplateHelper implementation

        public string PrintBuffer()
        {
            return _templateBuffer;
        }

        public abstract Task ReadTemplateAsync(string template);

        public async Task ReplaceTags(IDictionary<string, string> tagDictionary)
        {
            await Task.Run(() => { 
                _templateBuffer = new string(_templateContent);
                foreach(var kvp in tagDictionary)
                {
                    _templateBuffer = _templateBuffer.Replace($"##{kvp.Key}##", kvp.Value);
                }
            });
        }

        #endregion
    }
}
