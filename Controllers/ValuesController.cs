using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;
using Swashbuckle.Swagger.Annotations;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Configuration;
using Newtonsoft.Json;
using System.Web;
using System.Net.Http;

namespace Dpsk12.Ear.Controllers
{
    /// <summary>
    /// Get, Post, Update, and Delete forms in db
    /// </summary>
    public class ValuesController : ApiController
    {
        // GET api/values
        /// <summary>
        /// Get all forms
        /// </summary>
        /// <returns>List of data to populate list, or null</returns>
        [SwaggerOperation("GetAll")]
        public IEnumerable<FixedAsset> Get()
        {
            if (DpsAuth.IsAuthorized("admin")) // If logged in as admin
            {
                // Get db and colection
                var client = new MongoClient(ConfigurationManager.AppSettings["MongoDBConnectionString"]);
                var db = client.GetDatabase(ConfigurationManager.AppSettings["MongoDBName"]);
                var collection = db.GetCollection<FixedAsset>("Forms");

                var data = collection.Find<FixedAsset>(fa => true).ToList(); // Get all forms
                return data;
            } else
            {
                return null;
            }
        }

        // GET api/values/5
        /// <summary>
        /// Get specific form
        /// </summary>
        /// <param name="id">Mongo ObjectId of form</param>
        /// <returns>Form data, or null</returns>
        [SwaggerOperation("GetById")]
        [SwaggerResponse(HttpStatusCode.OK)]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        public FixedAsset Get(string id)
        {
            if (DpsAuth.IsAuthorized("admin")) // If logged in
            {
                // Get collection and db
                var client = new MongoClient(ConfigurationManager.AppSettings["MongoDBConnectionString"]);
                var db = client.GetDatabase(ConfigurationManager.AppSettings["MongoDBName"]);
                var collection = db.GetCollection<FixedAsset>("Forms");

                var data = collection.Find<FixedAsset>(fa => fa._id.Equals(new ObjectId(id))).First(); // Get document with matching ids
                return data;
            } else
            {
                return null;
            }
        }

        // POST api/values
        /// <summary>
        /// Make new form
        /// </summary>
        /// <param name="value">JSON -> FixedAsset data from form</param>
        [SwaggerOperation("Create")]
        [SwaggerResponse(HttpStatusCode.Created)]
        public void Post([FromBody]FixedAsset value)
        {
            // Get db and collection
            var client = new MongoClient(ConfigurationManager.AppSettings["MongoDBConnectionString"]);
            var db = client.GetDatabase(ConfigurationManager.AppSettings["MongoDBName"]);
            var collection = db.GetCollection<FixedAsset>("Forms");
            collection.InsertOne(value); // Insert new form
        }

        // PUT api/values/5
        /// <summary>
        /// Update form
        /// </summary>
        /// <param name="id">Mongo ObjectId of form to update</param>
        /// <param name="value">New data to put in form</param>
        /// <returns>
        /// 200 OK - Success
        /// 401 Unauthorized - Not logged in
        /// </returns>
        [SwaggerOperation("Update")]
        [SwaggerResponse(HttpStatusCode.OK)]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        public HttpResponseMessage Put(string id, [FromBody]FixedAsset value)
        {
            if (DpsAuth.IsAuthorized("admin")) // If logged in as an admin
            {
                // Get collection and db
                var client = new MongoClient(ConfigurationManager.AppSettings["MongoDBConnectionString"]);
                var db = client.GetDatabase(ConfigurationManager.AppSettings["MongoDBName"]);
                var collection = db.GetCollection<FixedAsset>("Forms");

                collection.FindOneAndDelete<FixedAsset>(fa => fa._id.Equals(new ObjectId(id))); // Delete old from
                collection.InsertOne(value); // Insert new form data
                return this.Request.CreateResponse(HttpStatusCode.OK); // 200
            } else
            {
                return this.Request.CreateResponse(HttpStatusCode.Unauthorized); // 401
            }
        }

        // DELETE api/values/5
        /// <summary>
        /// Delete Form
        /// </summary>
        /// <param name="id">Mongo ObjectId to delete</param>
        /// <returns>
        /// 200 OK - Success
        /// 401 Unauthorized - Not logged in
        /// </returns>
        [SwaggerOperation("Delete")]
        [SwaggerResponse(HttpStatusCode.OK)]
        [SwaggerResponse(HttpStatusCode.NotFound)]
        public HttpResponseMessage Delete(string id)
        {
            if (DpsAuth.IsAuthorized("admin")) // If logged in as an admin
            {
                // Get db and collection
                var client = new MongoClient(ConfigurationManager.AppSettings["MongoDBConnectionString"]);
                var db = client.GetDatabase(ConfigurationManager.AppSettings["MongoDBName"]);
                var collection = db.GetCollection<FixedAsset>("Forms");
                collection.FindOneAndDelete<FixedAsset>(fa => fa._id.Equals(new ObjectId(id))); // Delete form with matching id
                return this.Request.CreateResponse(HttpStatusCode.OK); // 200
            } else
            {
                return this.Request.CreateResponse(HttpStatusCode.Unauthorized); // 401
            } 
        }
    }
}
