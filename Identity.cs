using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace Dpsk12.Ear
{
    /// <summary>
    /// Identity of the current logged in user. Will be null if not logged in.
    /// </summary>
    public class Identity : IIdentity
    {
        public string Name { get; set; }
        public bool IsAuthenticated { get; set; }
        public string AuthenticationType { get; set; }
    }
}