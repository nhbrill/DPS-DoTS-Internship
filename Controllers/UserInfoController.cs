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
using System.Security.Cryptography;
using System.Net.Mail;
using System.Web.Security;

namespace Dpsk12.Ear.Controllers
{
    public class UserInfoController : ApiController
    {
        // GET: api/UserInfo
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/UserInfo/5
        public string Get(string id)
        {
            try
            {
                if (LoginController.prin.Identity.IsAuthenticated && id == LoginController.prin.Identity.Name) // Make sure you are logged into your own account
                {
                    var client = new MongoClient(ConfigurationManager.AppSettings["MongoDBConnectionString"]);
                    var db = client.GetDatabase(ConfigurationManager.AppSettings["MongoDBName"]);
                    var collection = db.GetCollection<LoginInfo>("Login");

                    var user = collection.Find(usr => usr.username.Equals(id)).ToList();
                    if (user.Count >= 1)
                    {
                        return user.First().email;
                    }
                    else
                    {
                        return "";
                    }
                }
                else
                {
                    return "";
                }
            }
            catch
            {
                return "";
            }
        }

        // POST: api/UserInfo
        public HttpStatusCode Post([FromBody]LoginInfo value)
        {
            try
            {
                if (LoginController.prin.Identity.IsAuthenticated && value.username == LoginController.prin.Identity.Name) // Make sure you are logged into your own account
                {
                    var client = new MongoClient(ConfigurationManager.AppSettings["MongoDBConnectionString"]);
                    var db = client.GetDatabase(ConfigurationManager.AppSettings["MongoDBName"]);
                    var collection = db.GetCollection<LoginInfo>("Login");

                    var user = collection.Find(usr => usr.username.Equals(value.username));

                    if (user.ToList().Count >= 1)
                    {
                        var email = value.email;
                        value = user.ToList().First();
                        value.email = email;
                        collection.FindOneAndDelete(usr => usr.username.Equals(value.username));
                        collection.InsertOne(value);

                        return HttpStatusCode.OK;
                    } else
                    {
                        return HttpStatusCode.NotFound;
                    }
                } else
                {
                    return HttpStatusCode.Unauthorized;
                }
            }
            catch (Exception e)
            {

                return HttpStatusCode.Unauthorized;
            }
            return HttpStatusCode.Unauthorized;
        }

        // PUT: api/UserInfo/5
        public void Put(string id, [FromBody]LoginInfo value)
        {
            var client = new MongoClient(ConfigurationManager.AppSettings["MongoDBConnectionString"]);
            var db = client.GetDatabase(ConfigurationManager.AppSettings["MongoDBName"]);
            var collection = db.GetCollection<LoginInfo>("Login");

            var user = collection.Find(usr => usr.username.Equals(id) && usr.email.Equals(value.email) && value.email != "").ToList();

            if (user.Count >= 1)
            {
                var newPw = GenNewPw();
                var toUser = new LoginInfo()
                {
                    username = id,
                    password = newPw,
                    email = value.email
                };
                UpdateController.UpdatePw(toUser);

                EmailUserNewPassword(value.email, newPw);
            }

        }

        private void EmailUserNewPassword(string email, string password)
        {
            //using (ImapClient ic = new ImapClient(ConfigurationManager.AppSettings["IMAPHost"], ConfigurationManager.AppSettings["IMAPEmail"], ConfigurationManager.AppSettings["IMAPPassword"], AuthMethods.Login, 993, true))
            //{
            //    ic.
            //}

            SmtpClient client = new SmtpClient(ConfigurationManager.AppSettings["EmailHost"], 587);
            client.EnableSsl = true;
            client.Credentials = new System.Net.NetworkCredential(ConfigurationManager.AppSettings["EmailEmail"], ConfigurationManager.AppSettings["EmailPassword"]);
            MailAddress from = new MailAddress(ConfigurationManager.AppSettings["EmailEmail"], "DPS EAR Form", System.Text.Encoding.UTF8);
            MailAddress to = new MailAddress(email);
            MailMessage message = new MailMessage(from, to)
            {
                Body = "This the DPS EAR Form Password reset. Your new temporary password is: " + password,
                Subject = "DPS EAR Form Password Reset"
            };
            client.SendCompleted += new SendCompletedEventHandler(FinishedSending);
            client.SendAsync(message, client);
        }

        private void FinishedSending(object sender, System.ComponentModel.AsyncCompletedEventArgs e)
        {
            SmtpClient client = sender as SmtpClient;
            client.Dispose();
        }

        private string GenNewPw()
        {
            //var pw = new StringBuilder();
            //Random r = new Random();
            //for (int l = 0; l < 10; l++)
            //{
            //    char[] chars = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789".ToCharArray();
            //    int i = r.Next(chars.Length);
            //    pw.Append(chars[i]);
            //}

            var pw = Membership.GeneratePassword(12, 1);

            return pw;
        }

        // DELETE: api/UserInfo/5
        public void Delete(int id)
        {
        }
    }
}
