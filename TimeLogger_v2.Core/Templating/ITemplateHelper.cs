using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace TimeLogger_v2.Core.Templating
{
    public interface ITemplateHelper
    {

        string PrintBuffer();
        Task ReadTemplateAsync(string template);
        Task ReplaceTags(IDictionary<string, string> tagDictionary);

    }
}
