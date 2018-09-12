using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace Dpsk12.Ear
{
    /// <summary>
    /// Check for authorization for a certain actions
    /// </summary>
    public class DpsAuth
    {
        /// <summary>
        /// Check for authorization of certain role in the Global login instance 'prin'
        /// </summary>
        /// <param name="role">Role to check for. For this site, will be either "user" or "admin", but could be anything</param>
        /// <returns>True if user is authorized, false if not</returns>
        public static bool IsAuthorized(string role)
        {
            if (Controllers.LoginController.prin.IsInRole(role) && Controllers.LoginController.prin.Identity.IsAuthenticated) {
                return true;
            } else
            {
                return false;
            }
        }

        /// <summary>
        /// Check for authorization of certain role in the Global login instance 'prin'
        /// </summary>
        /// <param name="role">Role to check for. For this site, will be either "user" or "admin", but could be anything</param>
        /// <param name="principal">Custom principal to check for authentication</param>
        /// <returns>True if user is authorized, false if not</returns>
        public static bool IsAuthorized(string role, IPrincipal principal)
        {
            if (principal.IsInRole(role) && principal.Identity.IsAuthenticated)
            {
                return true;
            } else
            {
                return false;
            }
        }
    }
}