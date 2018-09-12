using System.Web;
using MongoDB.Bson;
using MongoDB.Bson.IO;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using MongoDB.Bson.Serialization.Attributes;

namespace Dpsk12.Ear
{
    /// <summary>
    /// Serialized Class for JSON data being recieved from EAR form
    /// </summary>
    [BsonIgnoreExtraElements]
    public class FixedAsset
    {
        // All properties are lowercase because otherwise, the HTTP request doesn't automatically serialize the data. Not pretty, but it works.
        public ObjectId _id { get; set; }
        public string school { get; set; }
        public string siteCode { get; set; }
        public string dateMain { get; set; }
        public string documentNumber { get; set; }
        public string fadDoc { get; set; }
        public row[] rows { get; set; } // Row is another class right below
        public string transfer { get; set; }
        public bool warehouse { get; set; }
        public string forRD { get; set; }
        public string policeCase { get; set; }
        public string policeDate { get; set; }
        public policeFile policeFile { get; set; } // policeFile is another class right below
        public string warranty { get; set; }
        public string remarks { get; set; }
        public string purchase { get; set; }
        public string credit { get; set; }
        public string contact { get; set; }
        public string phone { get; set; }
        public string email { get; set; }
        public string approved { get; set; }
        public string aDate { get; set; }
        public string received { get; set; }
        public string rDate { get; set; }
        public string deliveredBy { get; set; }
        public string deliveredDate { get; set; }
        public string recordsBy { get; set; }
        public string recordsDate { get; set; }
       
    }
    public class policeFile
    {
        //You can also call: name, lastModifiedDate, lastModified, webkitRelativePath, size, and type
        public string dataURL { get; set; }
    }

    public class row
    {
        public string barcode { get; set; }
        public string itemDescription { get; set; }
        public string make { get; set; }
        public string model { get; set; }
        public string serial { get; set; }
        public bool servicable { get; set; }
    }
}