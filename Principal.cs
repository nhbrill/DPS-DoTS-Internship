using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Net;
using System.Web.Http;
using Swashbuckle.Swagger.Annotations;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Configuration;
using Newtonsoft.Json;
using System.Security.Cryptography;
using System.IO;
using System.Text;
using System.Web;

namespace Dpsk12.Ear
{
    /// <summary>
    /// Principal for currently signed in user
    /// </summary>
    public class Principal : IPrincipal
    {
        public IIdentity Identity { get; set; }

        /// <summary>
        /// Get current user from data base and check if they are in a certain role.
        /// </summary>
        /// <param name="role">Role to check against</param>
        /// <returns>True if the roles match, false if they don't.</returns>
        public bool IsInRole(string role)
        {
            var client = new MongoClient(ConfigurationManager.AppSettings["MongoDBConnectionString"]);
            var db = client.GetDatabase(ConfigurationManager.AppSettings["MongoDBName"]);
            var collection = db.GetCollection<LoginInfo>("Login");
            try // var user = collection.Find... will throw an error sometimes if the Identity isn't initialized or the Count is 0. Obviously if there is no identity, the user isn't signed in.
            {
                var user = collection.Find<LoginInfo>(usr => usr.username.Equals(this.Identity.Name) && usr.role.Equals(role)).ToList(); // Get a user in the db with a matching name and role
                if (user.Count() >= 1) // If that list isn't empty, the user is in that role
                {
                    return true;
                } else // Otherwise they aren't in that role
                {
                    return false;
                }
            } catch
            {
                return false;
            }
            
        }
    }
}
