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
using BCrypt.Net;

namespace Dpsk12.Ear.Controllers
{
    /// <summary>
    /// Handles Login requests, checks to see if the user is authenticated, and delete users from the db
    /// </summary>
    public class LoginController : ApiController
    {
        // Global identity and principal every controller can use to check authentication status
        public static Identity user = new Identity();
        public static Principal prin = new Principal();

        // GET: api/Login
        /// <summary>
        /// Gets the users authentication status
        /// </summary>
        /// <returns>Object will various data depending on if the user is signed in
        /// [0] - True if the user is signed in, false if not
        /// [1] - If the user is signed in, is the name of the user. If not is a blank string.
        /// [2] - If the user is signed in, is true is the user is an admin, false if not. If the user isn't signed in, it will be undefined
        /// </returns>
        public IEnumerable<object> Get()
        {
            try
            {
                if (prin.Identity.IsAuthenticated)
                {   
                    return new object[] { true, prin.Identity.Name, prin.IsInRole("admin") }; 
                }
                else
                {
                    return new object[] { false, ""  };
                }
            } catch {
                return new object[] { false, "" };
            }
        }

        private const string _pepper = "^q9C%xNMJ^uH83xu"; // Similar to salting password, pepper is just a constant added to end of password for more security
        // POST: api/Login
        public HttpStatusCode Post([FromBody]LoginInfo value)
        {
            // Get DB and Collections
            var client = new MongoClient(ConfigurationManager.AppSettings["MongoDBConnectionString"]);
            var db = client.GetDatabase(ConfigurationManager.AppSettings["MongoDBName"]);
            //var collection1 = db.GetCollection<LoginInfo>("Salts"); // Contains username and salt
            var collection = db.GetCollection<LoginInfo>("Login"); // Contains username, hashed password, and role

            // Find user in db
            var data = collection.Find<LoginInfo>(usr => usr.username.Equals(value.username)).ToList();
            //var salts = collection1.Find<LoginInfo>(usr => usr.username.Equals(value.username)).ToList();

            // If that username doesn't exist, you aren't signed in
            if (data.Count == 0)
            {
                return HttpStatusCode.Unauthorized; // 401
            }

            //var verifiedPw = BCrypt.Net.BCrypt.Verify(value.password + _pepper + salts[0].salt, data.First().password);
            var verifiedPw = BCrypt.Net.BCrypt.Verify(value.password + _pepper, data.First().password);
            // Get user wher encrypted pw matches db pw
            var data1 = collection.Find<LoginInfo>(usr => usr.username.Equals(value.username) && verifiedPw).ToList();

            if (data1.Count >= 1) // If that user exists
            {
                // Put that user into Identity and Prinipal 
                user.Name = value.username;
                user.IsAuthenticated = true;
                prin.Identity = user;
                return HttpStatusCode.OK; // 200
            } else
            {
                // Unauthorize user
                user.Name = value.username;
                user.IsAuthenticated = false;
                prin.Identity = user;
                return HttpStatusCode.Unauthorized; // 401
            }
        }

        // DELETE: api/Login/5
        // NOTE: Is actually unused becuase it return a 405 Method not allowed. (;_;)(;_;)(;_;)(;_;)(;_;)(;_;)(;_;)
        /// <summary>
        /// Delete account
        /// </summary>
        /// <param name="id">Name of user to </param>
        /// <returns></returns>
        public HttpStatusCode Delete(string id)
        {
            if (prin.Identity.IsAuthenticated && prin.Identity.Name == id) // Make sure the user is logged into their own account
            {
                // Get db and collections
                var client = new MongoClient(ConfigurationManager.AppSettings["MongoDBConnectionString"]);
                var db = client.GetDatabase(ConfigurationManager.AppSettings["MongoDBName"]);
                var collection1 = db.GetCollection<LoginInfo>("Salts");
                var collection = db.GetCollection<LoginInfo>("Login");

                if (collection.Find(usr => usr.username.Equals(id)).ToList().Count >= 0) // If that user exists
                {
                    // Delete the user from collections
                    collection.FindOneAndDelete(usr => usr.username.Equals(id));
                    collection1.FindOneAndDelete(usr => usr.username.Equals(id));
                    Controllers.LoginController.prin.Identity = null; // Sign out user
                    return HttpStatusCode.OK; // 200
                }
                else
                {
                    return HttpStatusCode.NotFound; // 404 - account doesn't exist
                }
            } else
            {
                return HttpStatusCode.Unauthorized; // 401
            }
        }
    }
}
