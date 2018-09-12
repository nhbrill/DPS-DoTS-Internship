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
    /// Makes new accounts and deletes accounts
    /// </summary>
    public class RegisterController : ApiController
    {
        private const string _pepper = "^q9C%xNMJ^uH83xu"; // Similar to salting password, pepper is just a constant added to end of password for more security
        // POST: api/Login
        /// <summary>
        /// Make new account
        /// </summary>
        /// <param name="value">Username, password</param>
        /// <returns>
        /// 406 NotAccepatable - Password or username is too short
        /// 201 Created - Success
        /// 409 Conflict - Account already exists
        /// </returns>
        public HttpStatusCode Post([FromBody]LoginInfo value)
        {
            // Get db and collections
            var client = new MongoClient(ConfigurationManager.AppSettings["MongoDBConnectionString"]);
            var db = client.GetDatabase(ConfigurationManager.AppSettings["MongoDBName"]);
            var collection1 = db.GetCollection<LoginInfo>("Salts");
            var collection = db.GetCollection<LoginInfo>("Login");

            if (value.username.Length < 2 || value.password.Length < 6) // Make sure password and username isn't too short
            {
                return HttpStatusCode.NotAcceptable; // 406
            }

            if (collection1.Find(usr => usr.username.Equals(value.username)).ToList().Count() < 1) // Make sure account doesn't already exist
            {
                // Generate new salt
                string salt = "";
                salt = BCrypt.Net.BCrypt.GenerateSalt(10);

                string pw;
                //pw = BCrypt.Net.BCrypt.HashPassword(value.password + _pepper + salt);
                pw = BCrypt.Net.BCrypt.HashPassword(value.password + _pepper, salt);

                value.salt = null; // Make null so a value isn't stored in this collection
                value.password = pw;
                value.role = "user";
                collection.InsertOne(value); // Insert username, password, and role into one collection

                value.salt = salt;
                value.password = null; // Make null so a value isn't stored in this collection
                value.role = null; // Make null so a value isn't stored in this collection
                collection1.InsertOne(value); // Insert username and salt in another collection

                return HttpStatusCode.Created; // 201
            }
            else
            {
                return HttpStatusCode.Conflict; // 409
            }
        }

        // DELETE: api/Login/5
        /// <summary>
        /// Delete account
        /// </summary>
        /// <param name="id">Name of user to </param>
        /// <returns></returns>
        public HttpStatusCode Delete(string id)
        {
            if (LoginController.prin.Identity.IsAuthenticated && id == LoginController.prin.Identity.Name) // Make sure the user is logged into their own account
            {
                // Get db and collections
                var client = new MongoClient(ConfigurationManager.AppSettings["MongoDBConnectionString"]);
                var db = client.GetDatabase(ConfigurationManager.AppSettings["MongoDBName"]);
                var collection1 = db.GetCollection<LoginInfo>("Salts");
                var collection = db.GetCollection<LoginInfo>("Login");

                if (collection.Find(usr => usr.username.Equals(id)).ToList().Count >= 1) // If that user exists
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
