using System.Web;
using MongoDB.Bson;
using MongoDB.Bson.IO;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using MongoDB.Bson.Serialization.Attributes;

namespace Dpsk12.Ear
{
    /// <summary>
    /// Information for logging in as well as registering for a new account
    /// </summary>
    [BsonIgnoreExtraElements]
    public class LoginInfo
    {
        public ObjectId _id { get; set; }
        public string username { get; set; }

        // BsonIgnoreIfNull is used because for the most security, the salts are in a seperate collection from the role and encrypted password.
        // This way, I can use the same class to append to both of those collections.
        [BsonIgnoreIfNull]
        public string password { get; set; }
        [BsonIgnoreIfNull]
        public string salt { get; set; } // Random number appended to end of password and then hashed for security. Each salt is different for each user.
        [BsonIgnoreIfNull]
        public string role { get; set; } // Either "user" or "admin"
        [BsonIgnoreIfNull]
        public string email { get; set; }
    }
}