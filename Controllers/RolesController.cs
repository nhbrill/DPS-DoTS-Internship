using System.Collections.Generic;
using System.Linq;
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
using System;
using System.Web;
using System.Net.Http;
using System.Security.Principal;

namespace Dpsk12.Ear.Controllers
{
    /// <summary>
    /// Update if user is a user or admin and log out users
    /// </summary>
    public class RolesController : ApiController
    {
        // POST: api/Roles
        /// <summary>
        /// Update if a user is a user or an admin
        /// </summary>
        /// <param name="value">
        /// User to update.
        /// value.role is the role to update the db to
        /// </param>
        /// <returns>
        /// 200 OK - Success
        /// 401 Unauthorized - Not logged in
        /// </returns>
        public HttpStatusCode Post([FromBody]LoginInfo value)
        {
            if (LoginController.prin.Identity.IsAuthenticated && LoginController.prin.IsInRole("admin")) // Make sure user is logged in
            {
                // Get db
                var client = new MongoClient(ConfigurationManager.AppSettings["MongoDBConnectionString"]);
                var db = client.GetDatabase(ConfigurationManager.AppSettings["MongoDBName"]);
                var collection = db.GetCollection<LoginInfo>("Login");

                var data = collection.Find<LoginInfo>(usr => usr.username.Equals(value.username)).ToList(); // Get user in db
                data.First().role = value.role; // Update that entry locally
                collection.FindOneAndDelete(usr => usr.username.Equals(value.username)); // Delete old entry in db
                collection.InsertOne(data.First()); // Add updated entry to db
                return HttpStatusCode.OK; // 200
            } else
            {
                return HttpStatusCode.Unauthorized; // 401
            }
        }

        // DELETE: api/Roles/5
        /// <summary>
        /// Log out of current account
        /// </summary>
        /// <param name="id">Doesn't actually matter what this value is</param>
        public void Delete(int id)
        {
            LoginController.prin.Identity = null; // Make identity null to there is no username and role
        }
    }
}
