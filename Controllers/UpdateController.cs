using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;
using Swashbuckle.Swagger.Annotations;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Configuration;
using Newtonsoft.Json;
using System.IO;
using System.Text;
using System;
using System.Web;
using System.Net.Http;
using System.Security.Principal;

namespace Dpsk12.Ear.Controllers
{
    /// <summary>
    /// 
    /// </summary>
    public class UpdateController : ApiController
    {
        // GET: api/Update
        /// <summary>
        /// Get list of users so the user can decided who to elevate to admin
        /// </summary>
        /// <returns>If logged in, returns <list type="LoginInfo">users</list> without passwords included. If logged out, or isn't admin, returns null</returns>
        public IEnumerable<LoginInfo> Get()
        {
            if (LoginController.prin.Identity.IsAuthenticated && LoginController.prin.IsInRole("admin")) // Check if user is logged in and an admin
            {
                // Gets db and collections
                var client = new MongoClient(ConfigurationManager.AppSettings["MongoDBConnectionString"]);
                var db = client.GetDatabase(ConfigurationManager.AppSettings["MongoDBName"]);
                var collection = db.GetCollection<LoginInfo>("Login");

                var data = collection.Find<LoginInfo>(usr => true).ToList(); // Get every user
                foreach (var item in data)
                {
                    item.password = null; // Make password null for everyone so you can't log in to their account
                }
                return data; // Users
            } else
            {
                return null;
            }
        }

        private const string _pepper = "^q9C%xNMJ^uH83xu";
        // POST: api/Update
        /// <summary>
        /// Update Password
        /// </summary>
        /// <param name="value">User to update password to</param>
        /// <returns>
        /// 406 NotAcceptable - New password is too short
        /// 200 OK - Success
        /// 404 NotFound - Account doesn't exist
        /// 401 Unauthorized - Not logged in
        /// </returns>
        public HttpStatusCode Post([FromBody]LoginInfo value)
        {
            try
            {
                if (LoginController.prin.Identity.IsAuthenticated && value.username == LoginController.prin.Identity.Name) // Make sure you are logged into your own account
                {
                    return UpdatePw(value);
                }
                else
                {
                    return HttpStatusCode.Unauthorized; //  401
                }
            } catch
            {
                return HttpStatusCode.Unauthorized;
            }
        }

        public static HttpStatusCode UpdatePw(LoginInfo value)
        {
            // Get db and collections
            var client = new MongoClient(ConfigurationManager.AppSettings["MongoDBConnectionString"]);
            var db = client.GetDatabase(ConfigurationManager.AppSettings["MongoDBName"]);
            var collection1 = db.GetCollection<LoginInfo>("Salts");
            var collection = db.GetCollection<LoginInfo>("Login");

            // Get user from each collection
            var data = collection.Find<LoginInfo>(usr => usr.username.Equals(value.username)).ToList();
            var salts = collection1.Find<LoginInfo>(usr => usr.username.Equals(value.username)).ToList();

            if (value.password.Length < 6) // If password is too short
            {
                return HttpStatusCode.NotAcceptable; // 406
            }

            if (collection1.Find(usr => usr.username.Equals(value.username)).ToList().Count() >= 1) // If account exists
            {
                // Generate new salt
                string salt = "";
                salt = BCrypt.Net.BCrypt.GenerateSalt(10);

                // Generate encrypted password
                string pw;
                pw = BCrypt.Net.BCrypt.HashPassword(value.password + _pepper, salt);

                // Update password
                value.salt = null;
                value.password = pw;
                value.role = collection.Find<LoginInfo>(usr => usr.username.Equals(value.username)).First().role;
                value.email = collection.Find<LoginInfo>(usr => usr.username.Equals(value.username)).First().email;
                collection.FindOneAndDelete(usr => usr.username.Equals(value.username));
                collection.InsertOne(value);

                // Update salt
                value.salt = salt;
                value.password = null;
                value.role = null;
                value.email = null;
                collection1.FindOneAndDelete(usr => usr.username.Equals(value.username));
                collection1.InsertOne(value);

                return HttpStatusCode.OK; // 200
            }
            else
            {
                return HttpStatusCode.NotFound; // 404
            }
        }

        // DELETE: api/Update/5
        // Unused because returns 405 Not Allowed (;_;)
        public HttpStatusCode Delete(string username)
        {
            var client = new MongoClient(ConfigurationManager.AppSettings["MongoDBConnectionString"]);
            var db = client.GetDatabase(ConfigurationManager.AppSettings["MongoDBName"]);
            var collection1 = db.GetCollection<LoginInfo>("Salts");
            var collection = db.GetCollection<LoginInfo>("Login");

            if (collection.Find(usr => usr.username.Equals(username)).ToList().Count >= 0) {
                collection.FindOneAndDelete(usr => usr.username.Equals(username));
                collection1.FindOneAndDelete(usr => usr.username.Equals(username));
                Controllers.LoginController.prin.Identity = null;
                return HttpStatusCode.OK;
            } else
            {
                return HttpStatusCode.NotFound;
            }
            
        }
    }
}
