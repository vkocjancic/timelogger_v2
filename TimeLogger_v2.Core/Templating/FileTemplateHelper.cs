using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace TimeLogger_v2.Core.Templating
{
    public class FileTemplateHelper : TemplateHelperBase
    {
        
        #region Declarations
        
        private string _rootPath; 

        #endregion

        #region Constructors

        public FileTemplateHelper(string rootPath) : base() => _rootPath = rootPath;

        #endregion

        #region TemplateHelperBase implementation

        public override async Task ReadTemplateAsync(string template)
        {
            _templateContent = await System.IO.File.ReadAllTextAsync(System.IO.Path.Combine(_rootPath, template));
        }

        #endregion

    }
}
